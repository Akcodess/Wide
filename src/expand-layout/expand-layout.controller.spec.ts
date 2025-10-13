import { Test, TestingModule } from '@nestjs/testing';
import { ExpandLayoutController } from './expand-layout.controller';

describe('ExpandLayoutController', () => {
  let controller: ExpandLayoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpandLayoutController],
    }).compile();

    controller = module.get<ExpandLayoutController>(ExpandLayoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
