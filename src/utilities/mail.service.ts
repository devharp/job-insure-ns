import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    email: string,
    templateName: string,
    replacements: Record<string, string>,
  ) {
    const templatePath = `./src/views/email-templates/${templateName}.html`;
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    let emailBody = htmlTemplate;
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        const placeholder = `{${key}}`;
        const value = replacements[key];
        emailBody = emailBody.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: templateName,
        html: emailBody,
      });
      this.logger.log(`Email sent to ${email}`);
      return {
        success: true,
        message: 'Check Your Gmail Account',
      };
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
