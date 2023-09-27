import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRegistrationModule } from './modules/user-registration/user-registration.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './schema/users/user.schema';
import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { Applicant, ApplicantSchema } from './schema/users/applicant.schema';
import {
  InsuranceAgent,
  InsuranceAgentSchema,
} from './schema/users/insurance-agent.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserLoginModule } from './modules/user-login/user-login.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.local.env' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // <-- path to the static files
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secret: 'your_secret_key_here',
    //   signOptions: { expiresIn: '1d' }, // Token expiration time
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE') + 'd',
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('CON_URI'),
      }),
      inject: [ConfigService],
    }),
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
    UserRegistrationModule,
    UserLoginModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
