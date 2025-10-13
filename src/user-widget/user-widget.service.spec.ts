import { Test, TestingModule } from '@nestjs/testing';
import { UserWidgetService } from './user-widget.service';

describe('UserWidgetService', () => {
  let service: UserWidgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWidgetService],
    }).compile();

    service = module.get<UserWidgetService>(UserWidgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
