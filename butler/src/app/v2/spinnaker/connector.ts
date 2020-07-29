import { CdConfiguration, Component, ConnectorResult, Deployment, SpinnakerPipeline } from '../interfaces'
import { ExpectedArtifact, Stage } from '../interfaces/spinnaker-pipeline.interface'
import { ICdConfigurationData, ISpinnakerConfigurationData } from '../../v1/api/configurations/interfaces'
import {
  getBakeStage, getDeleteUnusedStage,
  getDeploymentsEvaluationStage,
  getDeploymentStage,
  getHelmTemplateObject,
  getHelmValueObject, getRollbackDeploymentsStage
} from './templates'
import { getDestinationRulesStage } from './templates/destination-rules-stage'
import { getVirtualServiceStage } from './templates/virtual-service-stage'
import { getProxyEvaluationStage } from './templates/proxy-evaluation'

export class SpinnakerConnector {

  private currentStageId = 1

  public createV2Deployment(deployment: Deployment, activeComponents: Component[]): ConnectorResult {
    const pipeline: SpinnakerPipeline = this.buildSpinnakerPipeline(deployment, activeComponents)
    console.log(JSON.stringify(pipeline))
    return { status: 'SUCCEEDED' }
  }

  public buildSpinnakerPipeline(deployment: Deployment, activeComponents: Component[]): SpinnakerPipeline {
    return {
      application: '',
      name: `${deployment.id}`,
      expectedArtifacts: this.getExpectedArtifacts(deployment),
      stages: this.getStages(deployment, activeComponents)
    }
  }

  private getExpectedArtifacts(deployment: Deployment): ExpectedArtifact[] {
    const expectedArtifacts: ExpectedArtifact[] = []
    deployment.components?.forEach(component => {
      expectedArtifacts.push(getHelmTemplateObject(component, deployment.cdConfiguration))
      expectedArtifacts.push(getHelmValueObject(component, deployment.cdConfiguration))
    })
    return expectedArtifacts
  }

  private getStages(deployment: Deployment, activeComponents: Component[]): Stage[] {
    this.currentStageId = 1
    // TODO the order of the stages matter. Is this robust enough?
    return [
      ...this.getDeploymentStages(deployment),
      ...this.getProxyDeploymentStages(deployment, activeComponents),
      ...this.getDeploymentsEvaluationStage(deployment.components),
      ...this.getRollbackDeploymentsStage(deployment),
      ...this.getProxyDeploymentsEvaluationStage(deployment.components),
      ...this.getDeleteUnusedDeploymentsStage(deployment, activeComponents)
    ]
  }

  private getDeploymentStages(deployment: Deployment): Stage[] {
    const deploymentStages: Stage[] = []
    deployment.components?.forEach(component => {
      deploymentStages.push(getBakeStage(component, this.currentStageId++))
      deploymentStages.push(getDeploymentStage(component, deployment.cdConfiguration, this.currentStageId++))
    })
    return deploymentStages
  }

  private getProxyDeploymentStages(deployment: Deployment, activeComponents: Component[]): Stage[] {
    const proxyStages: Stage[] = []
    deployment.components?.forEach(component => {
      const activeByName: Component[] = this.getActiveComponentsByName(activeComponents, component.name) // TODO maybe filter by moove id?
      proxyStages.push(getDestinationRulesStage(component, deployment.cdConfiguration, this.currentStageId++))
      proxyStages.push(getVirtualServiceStage(component, deployment, activeByName, this.currentStageId++))
    })
    return proxyStages
  }

  private getDeploymentsEvaluationStage(components: Component[] | undefined): Stage[] {
    return components && components.length ?
      [getDeploymentsEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getRollbackDeploymentsStage(deployment: Deployment): Stage[] {
    const stages: Stage[] = []
    const evalStageId: number = this.currentStageId - 1
    deployment.components?.forEach(component => {
      stages.push(getRollbackDeploymentsStage(component, deployment.cdConfiguration, this.currentStageId++, evalStageId))
    })
    return stages
  }

  private getProxyDeploymentsEvaluationStage(components: Component[] | undefined): Stage[] {
    return components && components.length ?
      [getProxyEvaluationStage(components, this.currentStageId++)] :
      []
  }

  private getDeleteUnusedDeploymentsStage(deployment: Deployment, activeComponents: Component[]): Stage[] {
    const stages: Stage[] = []
    const evalStageId: number = this.currentStageId - 1
    deployment?.components?.forEach(component => {
      const activeByName: Component[] = this.getActiveComponentsByName(activeComponents, component.name) // TODO maybe filter by id?
      const unusedComponent: Component | undefined = this.getSameCircleActiveComponent(activeByName, deployment.circleId)
      if (unusedComponent) {
        stages.push(getDeleteUnusedStage(unusedComponent, deployment.cdConfiguration, this.currentStageId++, evalStageId))
      }
    })
    return stages
  }

  private getActiveComponentsByName(activeComponents: Component[], name: string): Component[] {
    return activeComponents.filter(component => component.name === name)
  }

  private getSameCircleActiveComponent(activeComponents: Component[], circleId: string | null): Component | undefined {
    return activeComponents
      .find(component => component.deployment && component.deployment.circleId === circleId)
  }
}