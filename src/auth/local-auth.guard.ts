import {
  Injectable,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { password } = request.body;
    if (err || !user) {
      if (!password) {
        throw new HttpException(
          { message: 'Password cannot be empty' },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw err || new UnauthorizedException();
      }
    }
    return user;
  }
}
