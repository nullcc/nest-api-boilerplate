import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

import { BaseEntity } from '@libs/database/entity/base.entity';

@Entity()
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false })
  userId: string;

  @Column()
  ip: string;

  @Column()
  description: string;

  @Column({ type: 'json' })
  parameters: any;
}
