import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/users/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Method is used to validate a user
   *
   * @param { string } username: Pass the username as a string
   * @param { string } password: Pass the password as a string
   * @returns { User | null }
   */
  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userModel
      .findOne(
        { $or: [{ email: username }, { mobileNo: username }] },
        { __v: 0, mobileNo: 0, dob: 0 },
      )
      .lean()
      .exec();

    return user && (await bcrypt.compare(password, user.password))
      ? user
      : null;
  }

  /**
   * Clean the user object by replacing _id with id, and removing the password field.
   * @param user - The user object to be cleaned.
   * @returns The cleaned user object without the password field.
   */
  cleanUser(user: User) {
    const { _id, password, ...cleanedUser } = user;
    return {
      ...cleanedUser,
      id: _id.toString(),
    };
  }

  /**
   * Generate and sign a JWT token for the given user.
   * @param user - The user for whom the JWT token will be generated.
   * @returns The generated JWT token.
   */
  generateJwtToken(user: User): string {
    const payload = this.cleanUser(user); // You can reuse the cleanUser method from the previous step
    return this.jwtService.sign(payload);
  }

  public async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }
}
