import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimeCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    // currentHour = 8;
    const isAllowedTime =
      (currentHour >= 6 && currentHour < 9) ||
      (currentHour >= 16 && currentHour < 19);
    if (!isAllowedTime) {
      throw new HttpException(
        'You are late. Please ask for permission from the admin.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
