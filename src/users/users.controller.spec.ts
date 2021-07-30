import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity'
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeUsersService : Partial<UsersService>;
  let fakeAuthService : Partial<AuthService>;

  beforeEach(async () => {

    // the controller uses some dependencies, we need to mock them or make a fake dependency

    fakeUsersService = {
      findOne : (id : number) => {
        return Promise.resolve({ id, name: 'John Doe', email: 'john@gmail.com', password : 'john' } as User)
      },
      find : (email : string) => {
        return Promise.resolve([{ id: 1, name: 'John Doe', email:'john@gmail.com', password : 'john' }as User])
      },
      // remove : () => {},
      // update : () => {}, 
    }

    // Promise.resolve() means that the function will return a promise / a asynchronously resolved promise
    fakeAuthService = {
      // we are making the mock representation of authservice 
      // by making signup and sigin functions
      // signup : () => {},
      signin : (name : string ,email : string, password : string) => {
        return Promise.resolve({ id: 1, name, email, password } as User)
      }
    }

    // whenever userscontroller wants userservice or authservice provide them
    // fakeusersevice and fakeauthservice

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //! 1st test
  it('findAllUsers returns a list of users with the given email', async() => {
    const users = await controller.findAllUsers('john@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('john@gmail.com');
  })

  //! 2nd test
  it('findUser returns a single user with given id', async () => {
    const user = await controller.findUser('1');

    expect(user.id).toEqual(1);
  })

  //! 3rd test
  it('findUser throws an error if the user with id is not found', async () => {
    fakeUsersService.findOne = () => null
    try {
      await controller.findUser('10');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('User Not Found');
    }
  })

  //! 4th test
  it('signIn updates session object and returns user', async () => {
    const session = { userId : -10};
    const user = await controller.signin({ name : 'john', email : 'john@gmail.com', password : 'john' }, 
      session
    )

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);

  })
});
