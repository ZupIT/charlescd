import { CdConfiguration, Component, ConnectorResult, Deployment, SpinnakerPipeline } from '../interfaces'
import { ExpectedArtifact, Stage } from '../interfaces/spinnaker-pipeline.interface'
import { ICdConfigurationData, ISpinnakerConfigurationData } from '../../v1/api/configurations/interfaces'
import { getBakeStage, getDeploymentStage, getHelmTemplateObject, getHelmValueObject } from './templates'
import { getDestinationRulesStage } from './templates/destination-rules-stage'
import { getVirtualServiceStage } from './templates/virtual-service-stage'

export class SpinnakerConnector {

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
    const stageId = 1
    return [
      ...this.getDeploymentStages(deployment, stageId),
      ...this.getProxyDeploymentStages(deployment, activeComponents, stageId)
    ]
  }

  private getDeploymentStages(deployment: Deployment, stageId: number): Stage[] {
    const deploymentStages: Stage[] = []
    deployment.components?.forEach(component => {
      deploymentStages.push(getBakeStage(component, stageId++))
      deploymentStages.push(getDeploymentStage(component, deployment.cdConfiguration, stageId++))
    })
    return deploymentStages
  }

  private getProxyDeploymentStages(deployment: Deployment, activeComponents: Component[], stageId: number): Stage[] {
    const proxyStages: Stage[] = []
    deployment.components?.forEach(component => {
      const activeByName: Component[] = this.getActiveComponentsByName(activeComponents, component.name) // TODO maybe filter by moove id?
      proxyStages.push(getDestinationRulesStage(component, deployment.cdConfiguration, stageId++))
      proxyStages.push(getVirtualServiceStage(component, deployment, activeByName, stageId++))
    })
    return proxyStages
  }

  private getActiveComponentsByName(activeComponents: Component[], name: string): Component[] {
    return activeComponents.filter(component => component.name === name)
  }
}