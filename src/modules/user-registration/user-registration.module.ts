import { Module } from '@nestjs/common';
import { UserRegistrationController } from './user-registration.controller';
import { UserRegistrationService } from './user-registration.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/users/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/utilities/mail.service';
import { TwilioService } from 'src/utilities/sms.service';
import { EncryptionService } from 'src/utilities/Encryption.service';
import { Applicant, ApplicantSchema } from 'src/schema/users/applicant.schema';
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mailerConfig = {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: configService.get<string>('MAIL_USER').replace(/['"]/g, ''),
              pass: configService.get<string>('MAIL_PASS').replace(/['"]/g, ''),
            },
          },
          defaults: {
            from: configService.get<string>('MAIL_USER').replace(/['"]/g, ''),
          },
        };
        return mailerConfig;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserRegistrationController],
  providers: [
    UserRegistrationService,
    MailService,
    TwilioService,
    EncryptionService,
  ],
  exports: [MailService],
})
export class UserRegistrationModule {}
