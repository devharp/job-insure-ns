import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  public OTPGeneration(length: number): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      let randomDigit: number = Math.floor(Math.random() * 10);
      otp += randomDigit;
    }
    return otp;
  }
}
