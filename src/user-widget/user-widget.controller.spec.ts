import { Test, TestingModule } from '@nestjs/testing';
import { UserWidgetController } from './user-widget.controller';

describe('UserWidgetController', () => {
  let controller: UserWidgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWidgetController],
    }).compile();

    controller = module.get<UserWidgetController>(UserWidgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
