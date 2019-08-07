import { Entity } from 'typeorm'

@Entity('deployment_modules')
export class DeploymentModule {

  public id: string

  public moduleId: string

  public buildImageTag: string
}
