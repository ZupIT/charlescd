import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Deployment } from './deployment.entity'

@Entity('deployment_modules')
export class DeploymentModule extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @ManyToOne(type => Deployment)
  @JoinColumn({ name: 'deployment_id' })
  public deployment: Deployment

  @Column({ name: 'module_id' })
  public moduleId: string

  @Column({ name: 'build_image_tag' })
  public buildImageTag: string
}
