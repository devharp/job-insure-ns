import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmpty,
  IsAlphanumeric,
} from 'class-validator';
import { USER_ROLE } from '../role.user.enum';

class BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  mobileNo: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.DAIRY_FARMER, USER_ROLE.DAIRY_INSPECTOR])
  role: string;
}

export class UserDTO extends BaseUserDTO {
  @IsOptional()
  @IsAlphanumeric()
  dairyInspectorLicense?: string;

  @IsOptional()
  @IsAlphanumeric()
  agriIdCard?: string;
}

export class UserDairyFarmerDTO extends BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.DAIRY_FARMER])
  role: string;

  @IsOptional()
  @IsEmpty({ message: 'dairyInspectorLicense is not allowed' })
  dairyInspectorLicense?: never;

  @IsNotEmpty()
  @IsAlphanumeric()
  agriIdCard: string;
}

export class UserDairyInspectorDTO extends BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.DAIRY_INSPECTOR])
  role: string;

  @IsOptional()
  @IsEmpty({ message: 'agriIdCard is not allowed' })
  agriIdCard?: never;

  @IsNotEmpty()
  @IsAlphanumeric()
  dairyInspectorLicense: string;
}
