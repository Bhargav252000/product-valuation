import { CanActivate, ExecutionContext } from '@nestjs/common';

//! Important Point to be note is that
//! In nest Middleware always run before any guards attach to them

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      return false;
    }

    return request.currentUser.admin;
  }
}
