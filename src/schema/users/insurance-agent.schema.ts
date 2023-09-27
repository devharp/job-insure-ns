// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User, UserSchemaClass } from './user.schema';

export type InsuranceAgentDocument = HydratedDocument<InsuranceAgent>;

@Schema({ collection: 'insurance-agent' })
export class InsuranceAgent extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop()
  licenseNumber: string;

  @Prop({ type: [String] })
  specializations: string[];

  @Prop({ default: false })
  isApproved: boolean;
}

@Exclude()
export class InsuranceAgentSchemaClass extends UserSchemaClass {
  @Expose({ name: 'licenseNumber' })
  licenseNumber: string;

  @Expose({ name: 'specializations' })
  specializations: string[];
}

export const InsuranceAgentSchema =
  SchemaFactory.createForClass(InsuranceAgent);
