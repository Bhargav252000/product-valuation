import{
  CanActivate,
  ExecutionContext
} from '@nestjs/common'

// This guard is used to check if the user is authenticated or not
// If not authenticated then the request is rejected means sends false value
// Guard always return a boolean value

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    return request.session.userId;

  } 
}








