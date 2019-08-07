import { DeploymentModule } from './deployment-module.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany, Column
} from 'typeorm'
import { ReadDeploymentDto } from '../dto'
import { DeploymentModuleResponse } from '../interface'

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

  constructor(
    authorId: string,
    description: string,
    callbackUrl: string,
    circleHeader: string
  ) {
    super()
    this.authorId = authorId
    this.description = description
    this.callbackUrl = callbackUrl
    this.circleHeader = circleHeader
  }

  private getDeploymentModulesResponseArray(): DeploymentModuleResponse[] {
    return this.modules.map(module => ({
      id: module.id,
      buildImageTag: module.buildImageTag
    }))
  }

  public toReadDto(): ReadDeploymentDto {
    return new ReadDeploymentDto(
      this.getDeploymentModulesResponseArray(),
      this.authorId,
      this.description,
      this.circleHeader
    )
  }
}
