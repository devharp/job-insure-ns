// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsAlphanumeric } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UserDairyFarmerDocument = HydratedDocument<UserDairyFarmer>;

@Schema({ collection: 'dairy-farmer' })
export class UserDairyFarmer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop()
  agriIdCard: string;
}

@Exclude()
export class UserDairyFarmerSchemaClass {
  @Expose({ name: 'agriIdCard' })
  @IsAlphanumeric()
  agriIdCard: string;
}

export const UserDairyFarmerSchema =
  SchemaFactory.createForClass(UserDairyFarmer);
