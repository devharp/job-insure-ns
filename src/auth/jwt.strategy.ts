import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    if (!payload || !payload?.id)
      throw new UnauthorizedException('Invalid token');

    // Validate token and handle token expiration error
    try {
      const { role, _id } = await this.authService.getUserById(payload.id);
      return { role, id: _id };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
