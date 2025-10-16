import { Module } from '@nestjs/common';

import { WidgetPagecodeService } from './widget-pagecode.service';
import { WidgetPagecodeController } from './widget-pagecode.controller';
import { PageWidgetController } from './page-widget.controller';

@Module({
  controllers: [WidgetPagecodeController, PageWidgetController],
  providers: [WidgetPagecodeService]
})
export class WidgetPagecodeModule { }
