import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

enum MilkType {
  Cow = 'Cow',
  Buffalo = 'Buffalo',
}

export class CreateMilkReportDto {
  @IsNotEmpty()
  @IsNumber()
  quantityL: number;

  @IsNotEmpty()
  @IsEnum(MilkType)
  milkType: MilkType;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsBoolean()
  isRejected: boolean;
}

export class UpdateMilkReportDto {
  @IsOptional()
  @IsNumber()
  quantityL: number;

  @IsOptional()
  @IsEnum(MilkType)
  milkType: MilkType;

  @IsOptional()
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

  @IsOptional()
  @IsBoolean()
  isRejected: boolean;
}
