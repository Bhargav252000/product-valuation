import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// APP_INTERCEPTOR is 
import { APP_INTERCEPTOR } from '@nestjs/core';
// Entity imports
import { User } from './users.entity';
// services 
import { UsersService } from './users.service';
import { AuthService } from './auth.service'; 
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
    // the below method is used for globally scoped interceptor
    // which means that for any request from any where (from any controller) this interceptor will work
    {
      provide : APP_INTERCEPTOR,
      useClass : CurrentUserInterceptor
    }
  ],
})
export class UsersModule {}
