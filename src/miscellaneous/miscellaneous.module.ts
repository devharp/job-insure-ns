import { Module } from '@nestjs/common';
import { MiscellaneousController } from './miscellaneous.controller';
import { miscellaneousService } from './miscellaneous.service';

@Module({
  imports: [],
  controllers: [MiscellaneousController],
  providers: [miscellaneousService],
})
export class MiscellaneousModule {}
