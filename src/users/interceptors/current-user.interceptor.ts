import{
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common'

import { UsersService } from '../users.service'

//! We made this interceptor because we cannot make use of usersService from the 
//! custom Decorator, because it is not a class.

//! Therefor we made use of interceptor, we first find the userId from the session object from interceptor
//! then we pass it to the request handler, this request is then recieved in the decorator and we can use it there

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  
  constructor(private usersService : UsersService){}

  async intercept(context : ExecutionContext, handler : CallHandler ){
    const request = context.switchToHttp().getRequest()

    const { userId } = request.session || {};

    if(userId){
      const user = await this.usersService.findOne(userId);

      if(user){
        request.currentUser = user
      }

    }

    return handler.handle()
  }

}








