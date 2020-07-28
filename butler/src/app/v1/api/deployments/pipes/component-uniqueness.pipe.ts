import { ConflictException, Injectable, PipeTransform } from '@nestjs/common'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../entity'
import { DeploymentsRepository } from '../repository/deployments.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { ComponentRepository } from '../repository/components.repository'
import { ComponentEntity } from '../../components/entity'
@Injectable()
export class ComponentUniquenessPipe implements PipeTransform {
  private errors: Error[]  = []

  constructor(
    @InjectRepository(DeploymentsRepository)
    private readonly deploymentsRepository: DeploymentsRepository,
    @InjectRepository(ComponentRepository)
    private readonly componentsRepository: ComponentRepository,
  ) {}

  public async  transform(deploymentRequest: DeploymentEntity): Promise<DeploymentEntity> {
    this.errors =  []
    await Promise.all(
      deploymentRequest.modules.map(
        moduleDeployment => this.validateUniquenessModule(moduleDeployment, deploymentRequest)
      )
    )
    if (this.errors.length) {
      throw new ConflictException(this.errors.map(error => error.message))
    }
    return deploymentRequest
  }
  private async validateUniquenessComponent(
    componentDeployment: ComponentDeploymentEntity,
    moduleId: string,
    cdConfigurationId: string,
  ): Promise<void> {

    const deployment =  await this.deploymentsRepository.findWithAllRelations(componentDeployment, moduleId, cdConfigurationId)

    if (!deployment) {
      return
    }

    const componentDeploymentRepeated = deployment.modules[0].components[0]
    const repeatedComponentDB = await this.componentsRepository.findOne(
      { where : {
        id: componentDeploymentRepeated?.componentId
      }
      })

    if (deployment && repeatedComponentDB?.isActive()) {
      this.errors.push(new Error(`A component with the name ${componentDeployment.componentName} and module name ${moduleId}  is already registered and has active deployments`))
    }
  }

  private async validateUniquenessModule(moduleDeployment: ModuleDeploymentEntity, deploymentRequest: DeploymentEntity): Promise<void[]> {
    console.log(moduleDeployment)
    return  await Promise.all(
      moduleDeployment.components.map(
        componentDeployment => this.validateUniquenessComponent(
          componentDeployment,
          moduleDeployment.moduleId,
          deploymentRequest.cdConfigurationId,
        )
      )
    )
  }
}
