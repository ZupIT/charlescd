import { DeploymentModule } from './deployment-module.entity'
import {
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('deployments')
export class Deployment {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  public modules: DeploymentModule[]

  public authorId: string

  public description: string

  public callbackUrl: string

  public circleHeader: string
}
