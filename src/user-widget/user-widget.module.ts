import { Module } from '@nestjs/common';
import { UserWidgetService } from './user-widget.service';
import { UserWidgetController } from './user-widget.controller';

@Module({
  providers: [UserWidgetService],
  controllers: [UserWidgetController]
})
export class UserWidgetModule {}
