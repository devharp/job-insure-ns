import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
export class resetPasswordDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  mobileNo: string;
}
export class updatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: string;
}
