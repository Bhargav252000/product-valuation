import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  // Nothing but just giving a name to particular test
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];

  beforeEach(async () => {
    // Create a fake copy of the users service
    // which will be used as a  users database for the tests
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          name,
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Here we made a fake dependency injection container,
    // we cant use the real one in testing, as they are all linked to each other
    const module = await Test.createTestingModule({
      providers: [
        //whenever authservice ask for userservice (as it is a dependency for authservice) test will provide a fake userservice
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  //! creates a test for signup only
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(
      'bhargav',
      'bhargav@gmail.com',
      'bhargav',
    );

    expect(user.password).not.toEqual('bhargav');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, name: 'asdf', email: 'a@gmail.com', password: '1' } as User,
    //   ]);
    // expect.assertions(2);

    await service.signup('asdf', 'asdf@asdf.com', 'asdf')

    try {
      await service.signup('asdf', 'asdf@asdf.com', 'asdf');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Email already exists');
    }
  });

  it('throws an error if signin is called with an unused email', async () => {
    try {
      await service.signin('sdfsd', 'dsfsd@gmail.com', 'asbjsndjna');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Email not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    // we are testing if the invalid password is provided in signin process 

    await service.signup('bhargav', 'asbd@gmail.com', 'asjbkasa')
    try {
      await service.signin('bhargav', 'asbd@gmail.com', 'euqofquenks');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Incorrect password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    
    await service.signup('bhargav', 'dfhbak@sjfba.com', 'bhargav');

    const user = await service.signin('bhargav', 'dfhbak@sjfba.com', 'bhargav');

    expect(user).toBeDefined();
  });
});
