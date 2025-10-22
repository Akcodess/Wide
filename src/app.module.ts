import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SettingModule } from './setting/setting.module';
import { UserWidgetModule } from './user-widget/user-widget.module';
import { WidgetPagecodeModule } from './widget-pagecode/widget-pagecode.module';
import { WidgetPositioningModule } from './widget-positioning/widget-positioning.module';
import { WidgetModule } from './widget/widget.module';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    TenantModule,
    AuthModule,
    SettingModule,
    UserWidgetModule,
    WidgetPagecodeModule,
    WidgetPositioningModule,
    WidgetModule,
  ]
})
export class AppModule {}
