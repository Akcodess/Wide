import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Widget } from '../widget/widget.entity';

@Entity('page_widget')
export class PageWidget {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'ApplicationCode', type: 'varchar', length: 100 })
  applicationCode: string;

  @Column({ name: 'PageCode', type: 'varchar', length: 100 })
  pageCode: string;

  @Column({ name: 'WidgetId', type: 'int' })
  widgetId: number;

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

  // Relation: Many PageWidgets belong to one Widget
  @ManyToOne(() => Widget, (widget) => widget.pageWidgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'WidgetId' })
  widget: Widget;
}