import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type MilkReportDocument = MilkReport & Document;

@Schema({ collection: 'milk-report' })
export class MilkReport {
  /*
  @Prop({ required: true })
  date: Date;
  */
  @Prop({ default: () => new Date() })
  date: Date;

  @Prop({ required: true })
  quantityL: number;

  @Prop({ enum: ['Cow', 'Buffalo'], required: true })
  milkType: string;

  @Prop({
    type: Object,
    required: true,
  })
  nutrients: {
    fatPercentage: number;
    clrPercentage: number;
    snf: number;
    milkRate: number;
    fatRate: number;
    snfRate: number;
    snfAmount: number;
    fatAmount: number;
    protein: number;
    carbohydrateLactose: number;
    zinc?: number;
    vitaminA?: number;
    vitaminD?: number;
    niacinVitaminB3?: number;
    riboflavinVitaminB2?: number;
    vitaminB12?: number;
    vitaminB6?: number;
    folateVitaminB9?: number;
    calcium?: number;
    phosphorus?: number;
    magnesium?: number;
    potassium?: number;
    sodium?: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  filledBy: User;

  @Prop({ required: true, default: false })
  isRejected: boolean;
}

export const MilkReportSchema = SchemaFactory.createForClass(MilkReport);
MilkReportSchema.plugin(mongoosePaginate);
