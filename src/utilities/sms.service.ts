import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(to: string, body: string): Promise<any> {
    try {
      await this.twilioClient.messages.create({
        body,
        to,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
      });
      return {
        success: true,
        message: 'Check Your SMS Box',
      };
    } catch (error) {
      throw new Error(`Twilio error: ${error.message}`);
    }
  }
}
