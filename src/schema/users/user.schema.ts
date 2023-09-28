import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, HydratedDocument, Types } from 'mongoose';

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

  @Prop({ enum: ['Applicant', 'InsuranceAgent'] })
  role: string;

  @Prop({
    type: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
    },
    _id: false,
  })
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
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

  @Expose({ name: 'address' })
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
