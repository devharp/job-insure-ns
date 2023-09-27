import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowedRoles) {
      // No roles specified for this route, allow access by default
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader)
      throw new UnauthorizedException('Authorization header not found');

    try {
      const { role } = this.jwtService.verify(
        authorizationHeader.split(' ')[1],
      );
      return allowedRoles.includes(role);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Token has expired. Please log in again.',
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException(
          'Invalid token. Please provide a valid token.',
        );
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
