import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpandLayoutModule } from './expand-layout/expand-layout.module';
import { SettingModule } from './setting/setting.module';
import { UserWidgetModule } from './user-widget/user-widget.module';
import { WidgetPagecodeModule } from './widget-pagecode/widget-pagecode.module';
import { WidgetPositioningModule } from './widget-positioning/widget-positioning.module';
import { WidgetModule } from './widget/widget.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ExpandLayoutModule,
    SettingModule,
    UserWidgetModule,
    WidgetPagecodeModule,
    WidgetPositioningModule,
    WidgetModule,
  ]
})
export class AppModule {}
