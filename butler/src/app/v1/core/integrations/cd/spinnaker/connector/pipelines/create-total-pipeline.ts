/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ISpinnakerPipelineConfiguration } from '../../interfaces'
import {
  BaseStagesUnion, IBaseSpinnakerPipeline, IBaseVirtualService, IBuildReturn, ICleanIds, IDeploymentReturn, IEmptyVirtualService
} from '../interfaces'
import baseStage from '../utils/base-default-stage'
import basePipeline from '../utils/base-spinnaker-pipeline'
import baseStageHelm from '../utils/base-stage-helm'
import webhookBaseStage from '../utils/base-webhook'
import { createBakeStage, createPrimaryId } from '../utils/helpers/create-id-names'
import baseDeleteDeployments from '../utils/manifests/base-delete-deployment'
import baseDeployment from '../utils/manifests/base-deployment'
import createDestinationRules from '../utils/manifests/base-destination-rules'
import { createVirtualService, createEmptyVirtualService } from '../utils/manifests/base-virtual-service'

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
    this.buildDeployments()
    this.buildWebhook()
    this.cleanIds()
    return this.basePipeline
  }

  public buildIstioPipeline(): IBaseSpinnakerPipeline {
    this.buildDestinationRules()
    this.buildVirtualService()
    this.buildDeleteDeployments()
    this.buildWebhook()
    return this.basePipeline
  }

  public buildUndeploymentPipeline(): IBaseSpinnakerPipeline {
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

  private getRequiredRefIds(refId: number) {
    return refId > 0 ? [String(refId)] : []
  }

  private buildDeployments(): IDeploymentReturn | undefined {
    if (this.contract.versions.length === 0) { return }

    this.contract.versions.forEach(version => {
      const helmStage = baseStageHelm(
        this.contract,
        this.contract.githubAccount,
        version.version,
        version.versionUrl,
        String(this.refId),
        [],
        undefined
      )
      this.basePipeline.stages.push(helmStage)
      this.increaseRefId()
      this.updatePreviousStage(createBakeStage(version.version))
      const deployment = baseDeployment(
        createPrimaryId('deployment', version.version),
        `Deploy ${version.version}`,
        String(this.refId),
        this.getRequiredRefIds(this.refId - 1),
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
    const destinationRules = createDestinationRules(this.contract.appName, this.contract.appNamespace, this.contract.circles,
      this.contract.versions, this.contract.hostValue)
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
    const virtualService: IBaseVirtualService | IEmptyVirtualService =
      this.contract.versions.length === 0
        ? createEmptyVirtualService(this.contract.appName, this.contract.appNamespace)
        : createVirtualService(
          this.contract.appName, this.contract.appNamespace, this.contract.circles, this.contract.hosts,
          this.contract.hostValue, this.contract.gatewayName
        )
    const virtualServiceStage = baseStage(
      virtualService,
      stageName,
      account,
      String(this.refId),
      this.getRequiredRefIds(this.refId - 1),
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

  private buildDeleteDeployments(): IBuildReturn | undefined {
    if (this.contract.unusedVersions.length) {
      const stageName = 'Delete Deployments'

      const deleteDeployments = baseDeleteDeployments(
        this.contract,
        this.refId,
        this.getRequiredRefIds(this.refId - 1),
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
      this.getRequiredRefIds(this.refId - 1),
      this.previousStage,
      this.contract.circleId,
      this.contract.callbackType
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
