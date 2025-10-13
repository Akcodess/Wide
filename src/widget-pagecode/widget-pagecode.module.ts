import { Module } from '@nestjs/common';
import { WidgetPagecodeService } from './widget-pagecode.service';
import { WidgetPagecodeController } from './widget-pagecode.controller';

@Module({
  providers: [WidgetPagecodeService],
  controllers: [WidgetPagecodeController]
})
export class WidgetPagecodeModule {}
