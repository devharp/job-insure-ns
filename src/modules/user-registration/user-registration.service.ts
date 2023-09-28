import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import mongoose, { Model, PaginateModel, PaginateResult } from 'mongoose';
import {
  ApplicantDTO,
  InsuranceAgentDTO,
  UserDTO,
} from 'src/constants/dto/user.dto.class';
import { USER_ROLE } from 'src/constants/role.user.enum';
import { User, UserSchemaClass } from 'src/schema/users/user.schema';
import * as bcrypt from 'bcrypt';
import {
  Applicant,
  ApplicantSchemaClass,
} from 'src/schema/users/applicant.schema';
import { MailService } from 'src/utilities/mail.service';
import { EncryptionService } from 'src/utilities/Encryption.service';
import { TwilioService } from 'src/utilities/sms.service';
import {
  InsuranceAgent,
  InsuranceAgentSchemaClass,
} from 'src/schema/users/insurance-agent.schema';

@Injectable()
export class UserRegistrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Applicant.name)
    private applicantModel: PaginateModel<Applicant>,
    @InjectModel(InsuranceAgent.name)
    private insuranceAgentModel: PaginateModel<InsuranceAgent>,
    private mailService: MailService,
    private encryptionService: EncryptionService,
    private smsService: TwilioService,
  ) {}

  async create(user: UserDTO): Promise<any> {
    try {
      switch (user.role) {
        case USER_ROLE.INSURANCE_APPLICANT:
          const userApplicant = plainToClass(ApplicantDTO, user);
          await this.validateUserDTO(userApplicant, ApplicantDTO);
          await this.addInsuranceApplicant(userApplicant);
          return { message: 'Insurance-Applicant' };
        case USER_ROLE.INSURANCE_AGENT:
          const userInsuranceAgent = plainToClass(InsuranceAgentDTO, user);
          await this.validateUserDTO(userInsuranceAgent, InsuranceAgentDTO);
          await this.addInsuranceAgent(userInsuranceAgent);
          return { message: 'Insurance-Agent' };
      }
      return 'ok';
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email or phone number already exists');
      } else {
        throw new InternalServerErrorException(error.response.message);
      }
    }
  }
  async findAll(
    role?: string,
    page: number = 1,
    perPage: number = 10,
    active?: Boolean,
  ): Promise<PaginateResult<User>> {
    const query: any = {};
    const options = {
      sort: { createdAt: -1 },
      page: page,
      limit: perPage,
      populate: { path: 'user', select: '-password -token' },
    };
    try {
      let users: any;
      switch (role) {
        case USER_ROLE.INSURANCE_APPLICANT:
          users = await this.applicantModel.paginate(query, options);
          break;

        case USER_ROLE.INSURANCE_AGENT:
          if (active) {
            query.isApproved = active;
          }
          users = await this.insuranceAgentModel.paginate(query, options);
          break;

        default:
          users = await this.insuranceAgentModel.paginate(query, options);
      }
      return users.docs.length !== 0
        ? users
        : Promise.reject(
            new HttpException('Users Not Found', HttpStatus.CONFLICT),
          );
    } catch (error) {
      throw new HttpException('Failed to fetch users', HttpStatus.BAD_REQUEST);
    }
  }

  async findById(
    id: string,
    to?: string,
  ): Promise<Applicant | InsuranceAgent | User> {
    return this.userModel.findById(id).exec();
    /*
    switch (to) {
      case USER_ROLE.INSURANCE_APPLICANT:
        return this.applicantModel.findById(id).exec();
        break;

      case USER_ROLE.INSURANCE_AGENT:
        return this.insuranceAgentModel.findById(id).exec();
    }
    */
  }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    try {
      const ObjectId = new mongoose.Types.ObjectId(id);
      await this.validateExistingUser(id);
      const deletedFromUserSchema = await this.userModel
        .findByIdAndDelete(id)
        .exec();
      deletedFromUserSchema.role === USER_ROLE.INSURANCE_APPLICANT
        ? await this.applicantModel.findOneAndDelete({ user: ObjectId }).exec()
        : await this.insuranceAgentModel
            .findOneAndDelete({ user: ObjectId })
            .exec();
      return deletedFromUserSchema;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private async addInsuranceApplicant(insuranceApplicant: ApplicantDTO) {
    const userData = await this.userModel.create(
      classToPlain(
        plainToClass(UserSchemaClass, {
          ...insuranceApplicant,
          password: await bcrypt.hash(insuranceApplicant.password, 10),
        }),
      ),
    );

    await this.applicantModel.create({
      ...classToPlain(plainToClass(ApplicantSchemaClass, insuranceApplicant)),
      user: userData._id,
    });
  }

  private async addInsuranceAgent(insuranceAgent: InsuranceAgentDTO) {
    const userData = await this.userModel.create(
      classToPlain(
        plainToClass(UserSchemaClass, {
          ...insuranceAgent,
          password: await bcrypt.hash(insuranceAgent.password, 10),
        }),
      ),
    );
    await this.insuranceAgentModel.create({
      ...classToPlain(plainToClass(InsuranceAgentSchemaClass, insuranceAgent)),
      user: userData._id,
    });
  }

  async healthCheck(email: string): Promise<any> {
    return this.mailService.sendEmail(email, 'email-verification', {
      verificationLink: 'https://www.opticalarc.com/',
    });
  }

  private async validateUserDTO(user: UserDTO, DTOClass: any): Promise<void> {
    const userObject = plainToClass(DTOClass, user);
    const validationErrors = await validate(userObject as object);
    if (validationErrors.length > 0) {
      const errorMessage = validationErrors
        .map((error) => Object.values(error.constraints).join(', '))
        .join(', ');
      throw new BadRequestException(errorMessage);
    }
  }

  public async resetPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    if (await this.userModel.findOne({ email })) {
      const otp: any = this.encryptionService.OTPGeneration(6);
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 10);
      await this.userModel.collection.updateOne(
        { email },
        {
          $set: {
            token: {
              otp,
              expiration,
            },
          },
        },
      );
      return this.mailService.sendEmail(email, 'reset-pass', {
        verificationCode: otp,
      });
    } else {
      throw new HttpException('Unknown Email', HttpStatus.UNAUTHORIZED);
    }
  }

  public async newPasswordUsingToken(
    newPassword: string,
    otp: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        {
          'token.otp': otp,
          'token.expiration': { $gt: new Date() },
        },
        {
          $set: {
            password: await bcrypt.hash(newPassword, 10),
            token: null,
          },
        },
        { new: true },
      );
      if (!updatedUser) {
        return Promise.reject(
          new HttpException('Invalid or expired OTP', HttpStatus.UNAUTHORIZED),
        );
      }
      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async validateExistingUser(userId: string): Promise<Boolean> {
    const existingUser: any = await this.findById(userId);
    return !existingUser
      ? Promise.reject(
          new HttpException('User not found', HttpStatus.NOT_FOUND),
        )
      : true;
  }
  async updateApproval(id: string, approval: Boolean): Promise<InsuranceAgent> {
    try {
      await this.validateExistingUser(id);
      return await this.insuranceAgentModel.findOneAndUpdate(
        { user: new mongoose.Types.ObjectId(id) },
        { $set: { isApproved: approval } },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
