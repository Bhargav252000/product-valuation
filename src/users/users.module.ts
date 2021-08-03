import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entity imports
import { User } from './users.entity';
// services
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

import { currentUserMiddleware } from './Middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {
  //! configure is a method that will make the middleware globally for 'users' module
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(currentUserMiddleware).forRoutes('*');
  }
}
