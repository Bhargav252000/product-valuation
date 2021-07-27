import { createParamDecorator, ExecutionContext } from '@nestjs/common';


//! data is anything we pass in the decorator
//! for example : @anyDecorator('this is data') 
export const CurrentUser = createParamDecorator(
  (data : never, context : ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId)
    return request.currentUser;
  }
)

