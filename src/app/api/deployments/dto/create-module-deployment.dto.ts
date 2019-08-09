import { ModuleDeploymentEntity } from '../entity/module-deployment.entity'
import { CreateComponentDeploymentDto } from './create-component-deployment.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateModuleDeploymentDto {

  public readonly moduleId: string

  @ValidateNested({ each: true })
  @Type(() => CreateComponentDeploymentDto)
  public readonly components: CreateComponentDeploymentDto[]

  public toEntity(): ModuleDeploymentEntity {
    return new ModuleDeploymentEntity(
      this.moduleId,
      this.components.map(component => component.toEntity())
    )
  }
}
