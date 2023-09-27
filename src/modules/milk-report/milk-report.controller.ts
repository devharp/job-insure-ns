import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { MilkReportService } from './milk-report.service';
import {
  CreateMilkReportDto,
  UpdateMilkReportDto,
} from 'src/constants/dto/milk-report.dto';
import { globalValidationPipe } from 'src/pipes/global-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
// import { UpdateMilkReportDto } from './dto/update-milk-report.dto';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('milk-report')
export class MilkReportController {
  constructor(private readonly milkReportService: MilkReportService) {}
  @Roles('dairy-inspector')
  @Post('entry')
  create(
    @Body(globalValidationPipe) createMilkReportDto: CreateMilkReportDto,
    @Request() req: any,
  ) {
    return this.milkReportService.create(createMilkReportDto, req.user.id);
  }
  @Roles('dairy-inspector')
  @Get()
  findAll(
    @Request() req: any,
    @Query('byMe') byMe: boolean,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('milkType') milkType?: string,
    @Query('isRejected') isRejected?: boolean,
  ) {
    return this.milkReportService.findAll(
      req.user.id,
      byMe,
      page,
      perPage,
      from,
      to,
      milkType,
      isRejected,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milkReportService.findOne(id);
  }

  @Roles('dairy-inspector')
  @Put(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body(globalValidationPipe) updateMilkReportDto: UpdateMilkReportDto,
  ) {
    return this.milkReportService.update(req.user.id, id, updateMilkReportDto);
  }

  @Roles('dairy-inspector')
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.milkReportService.remove(req.user.id, id);
  }
}

