import {ISpinnakerPipelineConfiguration} from '../../interfaces'
import {BaseStagesUnion, IBaseSpinnakerPipeline, IBuildReturn, IBuildService, ICleanIds, IDeploymentReturn} from '../interfaces'
import baseStage from '../utils/base-default-stage'
import basePipeline from '../utils/base-spinnaker-pipeline'
import baseStageHelm from '../utils/base-stage-helm'
import webhookBaseStage from '../utils/base-webhook'
import {createBakeStage, createPrimaryId} from '../utils/helpers/create-id-names'
import baseDeleteDeployments from '../utils/manifests/base-delete-deployment'
import baseDeployment from '../utils/manifests/base-deployment'
import createDestinationRules from '../utils/manifests/base-destination-rules'
import baseService from '../utils/manifests/base-service'
import createVirtualService from '../utils/manifests/base-virtual-service'

export default class TotalPipeline {
  refId: number
  previousStage: string
  previousStages: string[]
  deploymentsIds: string[]
  contract: ISpinnakerPipelineConfiguration
  basePipeline: IBaseSpinnakerPipeline
  constructor(contract: ISpinnakerPipelineConfiguration) {
    this.refId = 1
    this.previousStage = ''
    this.previousStages = []
    this.deploymentsIds = []
    this.contract = contract
    this.basePipeline = basePipeline(contract, this.contract.helmRepository, this.contract.githubAccount)
  }

    public buildPipeline(): IBaseSpinnakerPipeline {
    this.buildService()
    this.buildDeployments()
    this.buildDestinationRules()
    this.buildVirtualService()
    this.buildDeleteDeployments()
    this.buildWebhook()
    this.cleanIds()
    return this.basePipeline
  }

  private increaseRefId(): number {
    this.refId += 1
    return this.refId
  }

  private updatePreviousStage(stage: string): string {
    this.previousStage = stage
    return this.previousStage
  }

  private updatePreviousStages(stage: string): string[] {
    this.previousStages.push(stage)
    return this.previousStages
  }

  private buildService(): IBuildService {
    if (this.contract.versions.length === 0) { return }

    const stageName = 'Deploy Service'
    const { account, appName, appNamespace, appPort } = this.contract
    const serviceManifest = baseService(appName, appNamespace, appPort)
    const serviceStage = baseStage(serviceManifest, stageName, account, String(this.refId), [], undefined)
    this.basePipeline.stages.push(serviceStage)
    this.increaseRefId()
    this.updatePreviousStage(stageName)
    return {
      stages: this.basePipeline.stages,
      refId: this.refId,
      previousStages: this.previousStages
    }
  }

  private buildDeployments(): IDeploymentReturn {
    if (this.contract.versions.length === 0) { return }

    const preRefId = this.refId - 1
    this.contract.versions.forEach(version => {
      const helmStage = baseStageHelm(
        this.contract,
        this.contract.githubAccount,
        version.version,
        version.versionUrl,
        String(this.refId),
        [String(preRefId)],
        'Deploy Service'
      )
      this.basePipeline.stages.push(helmStage)
      this.increaseRefId()
      this.updatePreviousStage(createBakeStage(version.version))
      const deployment = baseDeployment(
        createPrimaryId('deployment', version.version),
        `Deploy ${version.version}`,
        String(this.refId),
        [String(this.refId - 1)],
        createBakeStage(version.version),
        this.contract.appName,
        this.contract.account
      )
      this.basePipeline.stages.push(deployment)
      this.deploymentsIds.push(String(this.refId))
      this.increaseRefId()
      this.updatePreviousStage(`Deploy ${version.version}`)
      this.updatePreviousStages(`Deploy ${version.version}`)
    })

    return {
      stages: this.basePipeline.stages,
      deploymentsIds: this.deploymentsIds,
      refId: this.refId,
      previousStage: this.previousStage,
      previousStages: this.previousStages
    }
  }

  private buildDestinationRules(): IBuildReturn {
    const stageName = 'Deploy Destination Rules'
    const { account } = this.contract
    const destinationRules = createDestinationRules(this.contract)
    const destinationRulesStage = baseStage(
      destinationRules,
      stageName,
      account,
      String(this.refId),
      this.deploymentsIds,
      this.previousStages
    )
    this.basePipeline.stages.push(destinationRulesStage)
    this.increaseRefId()
    this.updatePreviousStage(stageName)
    return {
      stages: this.basePipeline.stages,
      refId: this.refId,
      previousStage: this.previousStage
    }
  }

  private buildVirtualService(): IBuildReturn {
    const stageName = 'Deploy Virtual Service'
    const { account } = this.contract
    const virtualService = createVirtualService(this.contract)
    const virtualServiceStage = baseStage(
      virtualService,
      stageName,
      account,
      String(this.refId),
      [String(this.refId - 1)],
      this.previousStage
    )
    this.basePipeline.stages.push(virtualServiceStage)
    this.increaseRefId()
    this.updatePreviousStage(stageName)
    return {
      stages: this.basePipeline.stages,
      refId: this.refId,
      previousStage: this.previousStage
    }
  }

  private buildDeleteDeployments(): IBuildReturn {
    if (this.contract.unusedVersions.length) {
      const stageName = 'Delete Deployments'

      const deleteDeployments = baseDeleteDeployments(
        this.contract,
        this.refId,
        [String(this.refId - 1)],
        this.previousStage
      )
      this.basePipeline.stages.push(deleteDeployments)
      this.increaseRefId()
      this.updatePreviousStage(stageName)
      return {
        stages: this.basePipeline.stages,
        refId: this.refId,
        previousStage: this.previousStage
      }
    }
  }

  private buildWebhook(): BaseStagesUnion {
    const webhookStage = webhookBaseStage(
      this.contract.webhookUri,
      String(this.refId),
      [String(this.refId - 1)],
      this.previousStage,
      this.contract.circleId
    )
    this.basePipeline.stages.push(webhookStage)
    return this.basePipeline.stages
  }

  private cleanIds(): ICleanIds {
    this.refId = 1
    this.previousStage = ''
    this.deploymentsIds = []
    return {
      refId: this.refId,
      previousStage: this.previousStage,
      deploymentsIds: this.deploymentsIds
    }
  }
}
