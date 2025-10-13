import { Test, TestingModule } from '@nestjs/testing';
import { WidgetPagecodeService } from './widget-pagecode.service';

describe('WidgetPagecodeService', () => {
  let service: WidgetPagecodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetPagecodeService],
    }).compile();

    service = module.get<WidgetPagecodeService>(WidgetPagecodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
