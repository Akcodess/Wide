import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany} from 'typeorm';
import { PageWidget } from '../widget-pagecode/page-widget.entity';

@Entity('widget')
@Index(['widgetCode', 'applicationCode'], { unique: true })
export class Widget {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'WidgetName', type: 'varchar', nullable: true })
  widgetName: string;

  @Column({ name: 'WidgetCode', type: 'varchar', nullable: true })
  widgetCode: string;

  @Column({ name: 'ApplicationCode', type: 'varchar', nullable: true })
  applicationCode: string;

  @Column({ name: 'WidgetType', type: 'varchar', nullable: true })
  widgetType: string;

  @Column({ name: 'WidgetConfig', type: 'varchar', nullable: true })
  widgetConfig: string;

  @Column({ name: 'SourceData', type: 'text', nullable: true })
  sourceData: string;

  @Column({ name: 'SourceType', type: 'varchar', nullable: true })
  sourceType: string;

  @Column({ name: 'WidgetStyle', type: 'varchar', nullable: true })
  widgetStyle: string;

  @Column({ name: 'HeaderStyle', type: 'varchar', nullable: true })
  headerStyle: string;

  @Column({ name: 'UserIds', type: 'json', nullable: true })
  userIds: Record<string, any>;

  @Column({ name: 'Status', type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'IsShow', type: 'tinyint', default: 1 })
  isShow: number;

  @CreateDateColumn({ name: 'CreatedOn', type: 'timestamp' })
  createdOn: Date;

  @Column({ name: 'CreatedBy', type: 'int', nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: 'EditedOn', type: 'timestamp', nullable: true })
  editedOn: Date;

  @Column({ name: 'EditedBy', type: 'int', nullable: true })
  editedBy: number;

  @Column({ name: 'EntityState', type: 'tinyint', default: 1 })
  entityState: number;

  //Relation: Widget hasMany PageWidget
  @OneToMany(() => PageWidget, (pageWidget) => pageWidget.widget)
  pageWidgets: PageWidget[];
}