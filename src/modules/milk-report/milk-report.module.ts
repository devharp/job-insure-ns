import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MilkReportService } from './milk-report.service';
import { MilkReportController } from './milk-report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MilkReport,
  MilkReportSchema,
} from 'src/schema/milk-report/milk-report.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TimeCheckMiddleware } from 'src/middlewares/entry-time-check.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MilkReport.name, schema: MilkReportSchema },
    ]),
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
  ],
  controllers: [MilkReportController],
  providers: [MilkReportService],
})
export class MilkReportModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeCheckMiddleware).forRoutes('/milk-report/entry');
  }
}

