import { Test, TestingModule } from '@nestjs/testing';
import { MilkReportService } from './milk-report.service';

describe('MilkReportService', () => {
  let service: MilkReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MilkReportService],
    }).compile();

    service = module.get<MilkReportService>(MilkReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
