import { Test, TestingModule } from '@nestjs/testing';
import { WidgetPagecodeController } from './widget-pagecode.controller';

describe('WidgetPagecodeController', () => {
  let controller: WidgetPagecodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetPagecodeController],
    }).compile();

    controller = module.get<WidgetPagecodeController>(WidgetPagecodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
