// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UserDairyInspectorDocument = HydratedDocument<UserDairyInspector>;

@Schema({ collection: 'dairy-inspector' })
export class UserDairyInspector extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop()
  dairyInspectorLicense: string;
}

@Exclude()
export class UserDairyInspectorSchemaClass {
  @Expose({ name: 'dairyInspectorLicense' })
  @IsString()
  dairyInspectorLicense: string;
}

export const UserDairyInspectorSchema =
  SchemaFactory.createForClass(UserDairyInspector);
