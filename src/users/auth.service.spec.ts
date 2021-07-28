import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  // Nothing but just giving a name to particular test
  let service: AuthService;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (name: string, email: string, password: string) =>
        Promise.resolve({ id: 1, name, email, password } as User),
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
  it('creates a new user with a salted and hashed password', async ()=> {
    const user = await service.signup('bhargav','bhargav@gmail.com', 'bhargav')
    
    expect(user.password).not.toEqual('bhargav')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })


});
