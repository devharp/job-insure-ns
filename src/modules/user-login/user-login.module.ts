import { Module } from '@nestjs/common';
import { UserLoginController } from './user-login.controller';
import { UserLoginService } from './user-login.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users/user.schema';
import {
  UserDairyFarmer,
  UserDairyFarmerSchema,
} from 'src/schema/users/dairy-farmer.user.schema';
import {
  UserDairyInspector,
  UserDairyInspectorSchema,
} from 'src/schema/users/dairy-inspector.user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserDairyFarmer.name,
        schema: UserDairyFarmerSchema,
      },
      {
        name: UserDairyInspector.name,
        schema: UserDairyInspectorSchema,
      },
    ]),
    JwtModule.register({
      secret: 'your_secret_key_here',
      signOptions: { expiresIn: '1d' }, // Token expiration time (optional)
    }),
  ],
  controllers: [UserLoginController],
  providers: [UserLoginService],
})
export class UserLoginModule {}
