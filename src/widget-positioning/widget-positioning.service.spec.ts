import { Test, TestingModule } from '@nestjs/testing';
import { WidgetPositioningService } from './widget-positioning.service';

describe('WidgetPositioningService', () => {
  let service: WidgetPositioningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetPositioningService],
    }).compile();

    service = module.get<WidgetPositioningService>(WidgetPositioningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
