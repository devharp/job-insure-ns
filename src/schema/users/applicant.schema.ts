// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User, UserSchemaClass } from './user.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ApplicantDocument = HydratedDocument<Applicant>;

@Schema({ collection: 'applicant' })
export class Applicant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({
    type: {
      policyType: { type: String },
      premiumAmount: { type: Number },
      beneficiaries: [
        {
          _id: false,
          name: { type: String },
          relationship: { type: String },
        },
      ],
    },
    _id: false,
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
ApplicantSchema.plugin(mongoosePaginate);
