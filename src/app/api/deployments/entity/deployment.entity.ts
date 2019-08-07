import { DeploymentModule } from './deployment-module.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany, Column
} from 'typeorm'

@Entity('deployments')
export class Deployment extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @OneToMany(
    type => DeploymentModule,
    deploymentModule => deploymentModule.deployment
  )
  public modules: DeploymentModule[]

  @Column({ name: 'user_id' })
  public authorId: string

  @Column({ name: 'description'} )
  public description: string

  @Column({ name: 'callback_url'} )
  public callbackUrl: string

  @Column({ name: 'circle_header'} )
  public circleHeader: string
}
