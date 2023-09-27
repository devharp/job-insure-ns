import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/constants/dto/user-login.dto.class';
import { User } from 'src/schema/users/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserLoginService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async validate({
    username,
    password,
  }: LoginDto): Promise<User | null> {
    const user = await this.userModel
      .findOne({ $or: [{ email: username }, { mobileNo: username }] })
      .exec();

    return user && (await bcrypt.compare(password, user.password))
      ? user
      : null;
  }
}
