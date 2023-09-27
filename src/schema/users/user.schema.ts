import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, HydratedDocument } from 'mongoose';
import { USER_ROLE } from 'src/constants/role.user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop()
  fullname: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  mobileNo: string;

  @Prop({ enum: USER_ROLE, default: USER_ROLE.DAIRY_FARMER })
  role: string;

  @Prop({
    type: {
      token: { type: String, default: '' },
      expiration: { type: Date, default: null },
    },
    default: null,
  })
  token?: {
    otp: string;
    expiration: Date;
  };
}

@Exclude()
export class UserSchemaClass {
  @Expose({ name: 'fullname' })
  fullname: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'password' })
  password: string;

  @Expose({ name: 'mobileNo' })
  mobileNo: string;

  @Expose({ name: 'role' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
