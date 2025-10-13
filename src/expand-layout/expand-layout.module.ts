import { Module } from '@nestjs/common';
import { ExpandLayoutService } from './expand-layout.service';
import { ExpandLayoutController } from './expand-layout.controller';

@Module({
  providers: [ExpandLayoutService],
  controllers: [ExpandLayoutController]
})
export class ExpandLayoutModule {}
