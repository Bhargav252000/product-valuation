import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service"; 
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService : UsersService) {}

  async signup(name : string, email : string, password : string) {
    
    const users = await this.usersService.find(email);
    
    if(users.length){
      throw new BadRequestException("Email already exists");
    }

    const salt = randomBytes(8).toString("hex")

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString("hex");

    const user = await this.usersService.create(name, email, result);

    return user;
  }

  async signin(name : string ,email : string, password : string){
    const [user] = await this.usersService.find(email);

    if(!user){
      throw new NotFoundException("Email not found");
    }

    const salt = user.password.split('.')[0];
    const storedHash = user.password.split('.')[1];

    const hash2 = (await scrypt(password, salt, 32)) as Buffer;

    if(hash2.toString("hex") !== storedHash){
      throw new BadRequestException("Incorrect password");
    }

    return user;
  }

}



