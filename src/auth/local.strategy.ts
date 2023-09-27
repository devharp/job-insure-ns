import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from 'src/schema/users/user.schema';

/**
 * Passport Local Strategy for authentication using username and password.
 * This strategy is used for local authentication (username and password) using Passport.
 * It extends `PassportStrategy` and overrides the `validate` method to perform the user authentication.
 *
 * @class
 * @extends PassportStrategy(Strategy)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of the LocalStrategy.
   *
   * @constructor
   * @param {AuthService} authService - The AuthService instance to perform user authentication.
   */
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Validate the user credentials and generate a JWT token upon successful authentication.
   *
   * @async
   * @param {string} username - The username (email or mobile number) provided by the user.
   * @param {string} password - The password provided by the user.
   * @returns {Promise<string>} A Promise that resolves to a JWT token upon successful authentication.
   * @throws {UnauthorizedException} Throws an UnauthorizedException if the user credentials are invalid.
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    return user
      ? {
          ...(await this.authService.cleanUser(user)),
          access_token: this.authService.generateJwtToken(user),
        }
      : Promise.reject(new UnauthorizedException('Invalid email or password'));
  }
}
