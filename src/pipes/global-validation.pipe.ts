import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const globalValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});

// globalValidationPipe.transform = async function (value, metadata) {
//   const { metatype } = metadata;
//   if (!metatype || !this.toValidate(metatype)) {
//     return value;
//   }
//   const transformedValue = plainToClass(metatype, value);
//   const errors = await validate(transformedValue);
//   if (errors.length > 0) {
//     throw new BadRequestException(errors);
//   }
//   return transformedValue;
// };
