import {
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common'
import { ModuleEntity } from '../../modules/entity'
import { ComponentEntity } from '../../components/entity'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  DeploymentEntity
} from '../entity'
import {
  IPipelineCircle,
  IPipelineOptions,
  IPipelineVersion
} from '../../components/interfaces'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentDeploymentsRepository } from '../repository'
import { AppConstants } from '../../../core/constants'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentStatusEnum } from '../enums'
import { StatusManagementService } from '../../../core/services/deployments/'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { IConsulKV } from '../../../core/integrations/consul/interfaces'

@Injectable()
export class PipelinesService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(forwardRef(() => SpinnakerService))
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    private readonly deploymentsStatusManagementService: StatusManagementService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly configService: IConsulKV
  ) {}

  public async triggerUndeployment(
      componentDeploymentId: string,
      queueId: number
  ): Promise<void> {

    try {
      const pipelineCallbackUrl: string = this.getUndeploymentCallbackUrl(queueId)
      await this.processUndeploymentPipeline(componentDeploymentId)
      await this.triggerPipelineDeployment(componentDeploymentId, pipelineCallbackUrl, queueId)
    } catch (error) {
      throw error
    }
  }

  public async triggerDeployment(componentDeploymentId: string, defaultCircle: boolean, queueId: number): Promise<void> {

    try {
      const pipelineCallbackUrl: string = this.getDeploymentCallbackUrl(queueId)
      await this.processDeploymentPipeline(componentDeploymentId, defaultCircle)
      await this.triggerPipelineDeployment(componentDeploymentId, pipelineCallbackUrl, queueId)
    } catch (error) {
      throw error
    }
  }

  private getDeploymentCallbackUrl(queuedDeploymentId: number): string {
    return `${this.consulConfiguration.darwinDeploymentCallbackUrl}?queuedDeploymentId=${queuedDeploymentId}`
  }

  private getUndeploymentCallbackUrl(queuedUndeploymentId: number): string {
    return `${this.consulConfiguration.darwinUndeploymentCallbackUrl}?queuedUndeploymentId=${queuedUndeploymentId}`
  }

  private async processUndeploymentPipeline(componentDeploymentId: string): Promise<void> {

    try {
      const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
      const { circle } = componentDeployment.moduleDeployment.deployment
      const component: ComponentEntity =
        await this.componentsRepository.findOne({ id: componentDeployment.componentId })
      this.removeCircleFromPipeline(component.pipelineOptions, circle)
      this.removeUnusedPipelineVersions(component.pipelineOptions)
      await this.componentsRepository.save(component)
    } catch (error) {
      return Promise.reject({ error })
    }
  }

  private async processDeploymentPipeline(
    componentDeploymentId: string,
    defaultCircle: boolean
  ): Promise<void> {

    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })

    const componentDeployment: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const { circle } = componentDeployment.moduleDeployment.deployment
    await this.processComponentPipeline(componentDeployment, circle, defaultCircle)

    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_PIPELINE`, { componentDeploymentId })
  }

  private async deployComponentPipeline(
    componentDeployment: ComponentDeploymentEntity,
    deploymentId: string,
    pipelineCallbackUrl: string,
    queueId: number
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      await this.componentsRepository.findOne({ id: componentDeployment.componentId })

    const deploymentConfiguration: IDeploymentConfiguration =
      await this.deploymentConfigurationService.getConfiguration(componentDeployment.id)

    const deploymentEntity: DeploymentEntity =
      await this.deploymentsRepository.findOne({ id: deploymentId })

    await this.spinnakerService.createDeployment(
      componentEntity.pipelineOptions,
      deploymentConfiguration,
      componentDeployment.id,
      deploymentId,
      deploymentEntity.circleId,
      pipelineCallbackUrl,
      queueId
    )
  }

  public async deployComponent(
      componentDeploymentEntity: ComponentDeploymentEntity,
      pipelineCallbackUrl: string,
      queueId: number
  ): Promise<void> {

    const { moduleDeployment: { deployment: { id: deploymentId } } } = componentDeploymentEntity
    await this.deployComponentPipeline(componentDeploymentEntity, deploymentId, pipelineCallbackUrl, queueId)
  }

  private async triggerPipelineDeployment(
      componentDeploymentId: string,
      pipelineCallbackUrl: string,
      queueId: number
  ): Promise<void> {

    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    await this.deployComponent(componentDeploymentEntity, pipelineCallbackUrl, queueId)
    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
  }

  private async createModuleComponent(
    moduleEntity: ModuleEntity,
    componentDeployment: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions =
      this.createNewPipelineOptions(circle, componentDeployment, defaultCircle)

    return moduleEntity.addComponent(new ComponentEntity(
      componentDeployment.componentId,
      pipelineOptions
    ))
  }

  private createNewPipelineOptions(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineOptions {

    return {
      pipelineCircles: this.getNewPipelineCircles(circle, componentDeployment, defaultCircle),
      pipelineVersions: this.getNewPipelineVersions(componentDeployment),
      pipelineUnusedVersions: []
    }
  }

  private getNewPipelineVersions(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion[] {

    return [
      this.getNewPipelineVersionObject(componentDeployment)
    ]
  }

  private getNewPipelineHeaderlessCircles(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return [
      this.getPipelineHeaderlessCircleObject(componentDeployment)
    ]
  }

  private getPipelineRoutedCircles(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return !circle.removeCircle ?
      [this.getNewPipelineRoutedCircleObject(circle, componentDeployment)] :
      []
  }

  private getNewPipelineCircles(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineCircle[] {

    return defaultCircle ?
      this.getNewPipelineHeaderlessCircles(componentDeployment) :
      this.getPipelineRoutedCircles(circle, componentDeployment)
  }

  private async updateComponentPipelineObject(
    componentEntity: ComponentEntity,
    componentDeployment: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const pipelineOptions: IPipelineOptions = this.updatePipelineOptions(
      componentEntity.pipelineOptions, circle, componentDeployment, defaultCircle
    )
    return componentEntity.updatePipelineOptions(pipelineOptions)
  }

  private updatePipelineOptions(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineOptions {

    this.updatePipelineCircles(
      pipelineOptions, circle, componentDeployment, defaultCircle
    )

    this.updatePipelineVersions(
      pipelineOptions, componentDeployment
    )

    return pipelineOptions
  }

  private updatePipelineVersions(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion[] {

    this.removeUnusedPipelineVersions(pipelineOptions)
    this.updateRequestedVersion(pipelineOptions, componentDeployment)
    return pipelineOptions.pipelineVersions
  }

  private updateRequestedVersion(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineVersions = pipelineOptions.pipelineVersions.filter(
      pipelineVersion => pipelineVersion.version !== componentDeployment.buildImageTag
    )
    pipelineOptions.pipelineVersions.push(
      this.getNewPipelineVersionObject(componentDeployment)
    )
  }

  private getNewPipelineVersionObject(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion {

    return {
      versionUrl: componentDeployment.buildImageUrl,
      version: componentDeployment.buildImageTag
    }
  }

  private removeUnusedPipelineVersions(
    pipelineOptions: IPipelineOptions
  ): void {

    const currentVersions = pipelineOptions.pipelineVersions.filter(
      pipelineVersion => this.checkVersionUsage(pipelineVersion, pipelineOptions.pipelineCircles)
    )

    const unusedVersions = pipelineOptions.pipelineVersions.filter(v => !currentVersions.includes(v))

    pipelineOptions.pipelineVersions = currentVersions
    pipelineOptions.pipelineUnusedVersions = unusedVersions

  }

  private checkVersionUsage(
    pipelineVersion: IPipelineVersion,
    pipelineCircles: IPipelineCircle[]
  ): boolean {

    return !!pipelineCircles.find(pipelineCircle =>
      pipelineCircle.destination.version === pipelineVersion.version
    )
  }

  private updatePipelineCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineCircle[] {

    this.removeRequestedCircles(pipelineOptions, circle, defaultCircle)
    this.updateRequestedCircles(pipelineOptions, circle, componentDeployment, defaultCircle)
    return pipelineOptions.pipelineCircles
  }

  private removeRequestedHeaderlessCircles(
    pipelineOptions: IPipelineOptions
  ): void {

    pipelineOptions.pipelineCircles = pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !!pipelineCircle.header
    })
  }

  private removeRequestedRoutedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity
  ): void {

    if (circle.removeCircle) {
      this.removeCircleFromPipeline(pipelineOptions, circle)
    }
  }

  private removeCircleFromPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles = pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !pipelineCircle.header || pipelineCircle.header.headerValue !== circle.headerValue
    })
  }

  private addRoutedCircleToPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.unshift(
      this.getNewPipelineRoutedCircleObject(circle, componentDeployment)
    )
  }

  private getNewPipelineRoutedCircleObject(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle {

    return {
      header: {
        headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME,
        headerValue: circle.headerValue
      },
      destination: {
        version: componentDeployment.buildImageTag
      }
    }
  }

  private updatePipelineCircle(
    circle: CircleDeploymentEntity,
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    this.removeCircleFromPipeline(pipelineOptions, circle)
    this.addRoutedCircleToPipeline(pipelineOptions, circle, componentDeployment)
  }

  private removeRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): void {

    defaultCircle ?
      this.removeRequestedHeaderlessCircles(pipelineOptions) :
      this.removeRequestedRoutedCircles(pipelineOptions, circle)
  }

  private updateRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): void {

    defaultCircle ?
      this.updateRequestedHeaderlessCircles(pipelineOptions, componentDeployment) :
      this.updateRequestedRoutedCircles(pipelineOptions, circle, componentDeployment)
  }

  private updateRequestedHeaderlessCircles(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.push(
      this.getPipelineHeaderlessCircleObject(componentDeployment)
    )
  }

  private getPipelineHeaderlessCircleObject(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle {

    return {
      destination: {
        version: componentDeployment.buildImageTag
      }
    }
  }

  private updateRequestedRoutedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    if (!circle.removeCircle) {
      this.updatePipelineCircle(circle, pipelineOptions, componentDeployment)
    }
  }

  private async updateModuleComponentPipeline(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      moduleEntity.getComponentById(componentDeploymentEntity.componentId)

    componentEntity ?
      await this.updateComponentPipelineObject(componentEntity, componentDeploymentEntity, circle, defaultCircle) :
      await this.createModuleComponent(moduleEntity, componentDeploymentEntity, circle, defaultCircle)
  }

  private async updateModuleEntity(
    moduleEntity: ModuleEntity,
    componentDeploymentEntity: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<ModuleEntity> {

    await this.updateModuleComponentPipeline(moduleEntity, componentDeploymentEntity, circle, defaultCircle)
    return this.modulesRepository.save(moduleEntity)
  }

  private async processComponentPipeline(
    componentDeploymentEntity: ComponentDeploymentEntity,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): Promise<ModuleEntity> {

    const { moduleDeployment: moduleDeploymentEntity } = componentDeploymentEntity
    const moduleEntity: ModuleEntity =
      await this.modulesRepository.findOne({ id: moduleDeploymentEntity.moduleId })
    return this.updateModuleEntity(moduleEntity, componentDeploymentEntity, circle, defaultCircle)
  }
}
