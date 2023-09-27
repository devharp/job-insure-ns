import { Module } from '@nestjs/common';
import { UserLoginController } from './user-login.controller';
import { UserLoginService } from './user-login.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users/user.schema';
import { Applicant, ApplicantSchema } from 'src/schema/users/applicant.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  InsuranceAgent,
  InsuranceAgentSchema,
} from 'src/schema/users/insurance-agent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Applicant.name,
        schema: ApplicantSchema,
      },
      {
        name: InsuranceAgent.name,
        schema: InsuranceAgentSchema,
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
