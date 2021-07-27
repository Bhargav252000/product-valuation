import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';


// this interface means any class...
// the Serialize interceptor must only take a class and thus we have to make sure its only a class 
interface ClassConstructor{
  new (...args : any[]) : {}
}

// Custom Decorator
export function Serialize(dto : ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}


export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto : any) {}

  intercept(context : ExecutionContext, handler : CallHandler) : Observable<any> {
    // Run something before the a request is handled
    // by the request handler.
    // console.log('I am running before the handler', context);

    return handler.handle().pipe(
      map((data : any) => {
        // Run something before  the response is sent
        return plainToClass(this.dto , data, {
          excludeExtraneousValues: true, // exclude properties that are not defined in the class
        });
      })
    )
  }
}







