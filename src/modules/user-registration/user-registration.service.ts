import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Model } from 'mongoose';
import {
  UserDTO,
  UserDairyFarmerDTO,
  UserDairyInspectorDTO,
} from 'src/constants/dto/user.dto.class';
import { USER_ROLE } from 'src/constants/role.user.enum';
import { User, UserSchemaClass } from 'src/schema/users/user.schema';
import * as bcrypt from 'bcrypt';
import {
  UserDairyFarmer,
  UserDairyFarmerSchemaClass,
} from 'src/schema/users/dairy-farmer.user.schema';
import {
  UserDairyInspector,
  UserDairyInspectorSchemaClass,
} from 'src/schema/users/dairy-inspector.user.schema';
import { MailService } from 'src/utilities/mail.service';
import { EncryptionService } from 'src/utilities/Encryption.service';
import { TwilioService } from 'src/utilities/sms.service';

@Injectable()
export class UserRegistrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserDairyFarmer.name)
    private userDairyFarmerModel: Model<UserDairyFarmer>,
    @InjectModel(UserDairyInspector.name)
    private userDairyInspectorModel: Model<UserDairyInspector>,
    private mailService: MailService,
    private encryptionService: EncryptionService,
    private smsService: TwilioService,
  ) {}

  async create(user: UserDTO): Promise<any> {
    try {
      switch (user.role) {
        case USER_ROLE.DAIRY_FARMER:
          const userDairyFarmer = plainToClass(UserDairyFarmerDTO, user);
          await this.validateUserDTO(userDairyFarmer, UserDairyFarmerDTO);
          this.addDairyFarmer(userDairyFarmer);
          return { message: 'dairy-farmer' };
        case USER_ROLE.DAIRY_INSPECTOR:
          const userDairyInspector = plainToClass(UserDairyInspectorDTO, user);
          await this.validateUserDTO(userDairyInspector, UserDairyInspectorDTO);
          this.addDairyInspector(userDairyInspector);
          return { message: 'dairy-inspector' };
      }
      return 'ok';
    } catch (error) {
      throw new InternalServerErrorException(
        'An error has occurred while adding a user',
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  private async addDairyFarmer(dairyFarmer: UserDairyFarmerDTO) {
    const userData = await this.userModel.create(
      classToPlain(
        plainToClass(UserSchemaClass, {
          ...dairyFarmer,
          password: await bcrypt.hash(dairyFarmer.password, 10),
        }),
      ),
    );
    await this.userDairyFarmerModel.create({
      ...classToPlain(plainToClass(UserDairyFarmerSchemaClass, dairyFarmer)),
      user: userData._id,
    });
  }

  private async addDairyInspector(dairyInspector: UserDairyInspectorDTO) {
    try {
      const userData = await this.userModel.create(
        classToPlain(
          plainToClass(UserSchemaClass, {
            ...dairyInspector,
            password: await bcrypt.hash(dairyInspector.password, 10),
          }),
        ),
      );
      await this.userDairyInspectorModel.create({
        ...classToPlain(
          plainToClass(UserDairyInspectorSchemaClass, dairyInspector),
        ),
        user: userData._id,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error has occurred while adding a user',
      );
    }
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
    mobileNo: string,
  ): Promise<{ success: boolean; message: string }> {
    if (await this.userModel.findOne({ mobileNo })) {
      const otp: any = this.encryptionService.OTPGeneration(6);
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 10);
      await this.userModel.collection.updateOne(
        { mobileNo },
        {
          $set: {
            token: {
              otp,
              expiration,
            },
          },
        },
      );
      return await this.smsService.sendSms(
        mobileNo,
        `Hello! Your OTP to reset your password is:${otp}. If you didn't request this, please ignore this message.
      `,
      );
    } else {
      throw new HttpException('Unknown Number', HttpStatus.UNAUTHORIZED);
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
}
