import { IsEmail, IsString, Length, MinLength } from "class-validator";


export class CreateUserDto {

  @IsString()
  @Length(2,50)
  name : string;
  
  @IsEmail()
  email : string;
  
  @IsString()
  @MinLength(6)
  password : string;

}
