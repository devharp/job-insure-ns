// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User, UserSchemaClass } from './user.schema';

export type ApplicantDocument = HydratedDocument<Applicant>;

@Schema({ collection: 'applicant' })
export class Applicant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop({
    type: {
      policyType: { type: String },
      premiumAmount: { type: Number },
      beneficiaries: [
        {
          name: { type: String },
          relationship: { type: String },
        },
      ],
    },
  })
  policyDetails?: {
    policyType: string;
    premiumAmount: number;
    beneficiaries: {
      name: string;
      relationship: string;
    }[];
  };

  @Prop()
  currentCompany: string;

  @Prop()
  currentLocation: string;
}

@Exclude()
export class ApplicantSchemaClass extends UserSchemaClass {
  @Expose({ name: 'policyDetails' })
  policyDetails: {
    policyType: string;
    premiumAmount: number;
    beneficiaries: {
      name: string;
      relationship: string;
    }[];
  };
  @Expose({ name: 'currentCompany' })
  currentCompany: string;

  @Expose({ name: 'currentLocation' })
  currentLocation: string;
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant);
