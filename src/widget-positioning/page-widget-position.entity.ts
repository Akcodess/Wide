import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';

@Entity('page_widget_position')
@Index(['widgetId', 'applicationCode', 'pageCode'], { unique: true })
export class PageWidgetPosition {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'WidgetId', type: 'varchar', nullable: false })
  widgetId: string;

  @Column({ name: 'PageCode', type: 'varchar', length: 100, nullable: false })
  pageCode: string;

  @Column({ name: 'ApplicationCode', type: 'varchar', length: 100, nullable: false })
  applicationCode: string;

  @Column({ name: 'Position', type: 'varchar', nullable: false })
  position: string;

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
}