import { Test, TestingModule } from '@nestjs/testing';
import { WidgetPositioningController } from './widget-positioning.controller';

describe('WidgetPositioningController', () => {
  let controller: WidgetPositioningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetPositioningController],
    }).compile();

    controller = module.get<WidgetPositioningController>(WidgetPositioningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
