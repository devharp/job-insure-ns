import { Test, TestingModule } from '@nestjs/testing';
import { MilkReportController } from './milk-report.controller';
import { MilkReportService } from './milk-report.service';

describe('MilkReportController', () => {
  let controller: MilkReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilkReportController],
      providers: [MilkReportService],
    }).compile();

    controller = module.get<MilkReportController>(MilkReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
