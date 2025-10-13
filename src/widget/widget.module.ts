import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Widget } from './widget.entity';

import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { PageWidget } from '../widget-pagecode/page-widget.entity';
import { PageWidgetPosition } from '../widget-positioning/page-widget-position.entity';
import { UserWidgetPosition } from '../user-widget/user-widget-position.entity';
import { Setting } from '../setting/setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Widget, PageWidget, PageWidgetPosition, UserWidgetPosition, Setting])],
  providers: [WidgetService],
  controllers: [WidgetController],
  exports: [WidgetService],
})
export class WidgetModule {}
