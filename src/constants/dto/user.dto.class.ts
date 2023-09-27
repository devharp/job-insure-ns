import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmpty,
  IsAlphanumeric,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { USER_ROLE } from '../role.user.enum';

class AddressDTO {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;
}

class PolicyDetailsDTO {
  @IsNotEmpty()
  @IsString()
  policyType: string;

  @IsNotEmpty()
  @IsNumber()
  premiumAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  beneficiaries: BeneficiaryDTO[];
}
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
  @IsIn([USER_ROLE.INSURANCE_AGENT, USER_ROLE.INSURANCE_APPLICANT])
  role: string;

  @IsOptional()
  address: AddressDTO;
}

export class UserDTO extends BaseUserDTO {
  @IsOptional()
  policyDetails?: PolicyDetailsDTO;

  @IsOptional()
  @IsString()
  currentCompany?: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];
}

class BeneficiaryDTO {
  @IsString()
  name: string;

  @IsString()
  relationship: string;
}

export class ApplicantDTO extends BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.INSURANCE_APPLICANT])
  role: string;

  @IsOptional()
  policyDetails?: PolicyDetailsDTO;

  @IsOptional()
  @IsString()
  currentCompany?: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;
}

export class InsuranceAgentDTO extends BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.INSURANCE_AGENT])
  role: string;

  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @IsArray()
  @IsString({ each: true })
  specializations: string[];
}
