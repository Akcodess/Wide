import { Test, TestingModule } from '@nestjs/testing';
import { ExpandLayoutService } from './expand-layout.service';

describe('ExpandLayoutService', () => {
  let service: ExpandLayoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpandLayoutService],
    }).compile();

    service = module.get<ExpandLayoutService>(ExpandLayoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
