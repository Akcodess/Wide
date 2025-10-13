import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { PageWidgetPosition } from "./page-widget-position.entity";
import { WidgetPositioningService } from './widget-positioning.service';
import { WidgetPositioningController } from './widget-positioning.controller';

@Module({
  // imports: [TypeOrmModule.forFeature([PageWidgetPosition])],
  providers: [WidgetPositioningService],
  controllers: [WidgetPositioningController],
  exports: [WidgetPositioningService],
})
export class WidgetPositioningModule {}
