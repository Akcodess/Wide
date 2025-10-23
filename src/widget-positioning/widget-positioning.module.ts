import { Module } from '@nestjs/common';
import { WidgetPositioningService } from './widget-positioning.service';
import { WidgetPositioningController } from './widget-positioning.controller';

@Module({
  providers: [WidgetPositioningService],
  controllers: [WidgetPositioningController],
  exports: [WidgetPositioningService],
})
export class WidgetPositioningModule {}
