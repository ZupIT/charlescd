import { ModuleDeploymentEntity } from '../../entity'
import { CreateComponentDeploymentDto } from './create-component-deployment.dto'
import {
  IsDefined,
  IsNotEmpty,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateModuleDeploymentDto {

  @IsNotEmpty()
  public readonly moduleId: string

  @IsNotEmpty()
  public readonly helmRepository: string

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateComponentDeploymentDto)
  public readonly components: CreateComponentDeploymentDto[]

  public toEntity(): ModuleDeploymentEntity {
    return new ModuleDeploymentEntity(
      this.moduleId,
      this.helmRepository,
      this.components.map(component => component.toEntity())
    )
  }
}
