import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
export class resetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class updatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: string;
}
