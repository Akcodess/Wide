import { Module } from '@nestjs/common';

import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [TenantModule],
  providers: [WidgetService],
  controllers: [WidgetController],
  exports: [WidgetService],
})
export class WidgetModule {}
