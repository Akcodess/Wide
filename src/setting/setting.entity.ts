import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index} from 'typeorm';

@Entity('setting')
@Index(['applicationCode', 'pageCode'], { unique: true })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  pageCode: string;

  @Column({ type: 'json' })
  settingConfig: Record<string, any>;

  @Column({ type: 'varchar', length: 100 })
  applicationCode: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdOn: Date;

  @Column({ type: 'int', nullable: true })
  createdBy: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  editedOn: Date;

  @Column({ type: 'int', nullable: true })
  editedBy: number;

  @Column({ type: 'tinyint', default: 1 })
  entityState: number;
}
