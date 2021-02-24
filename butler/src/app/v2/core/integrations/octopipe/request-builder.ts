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

import { OctopipeConfigurationData } from '../../../api/configurations/interfaces'
import { CdConfiguration, Component, Deployment } from '../../../api/deployments/interfaces'
import { DeploymentComponent } from '../../../api/deployments/interfaces/deployment.interface'
import { UrlUtils } from '../../utils/url.utils'
import { ConnectorConfiguration } from '../interfaces/connector-configuration.interface'
import { K8sManifest } from '../interfaces/k8s-manifest.interface'
import { CommonTemplateUtils } from '../spinnaker/utils/common-template.utils'
import { componentsToBeRemoved, DeploymentUtils, unusedComponentProxy } from '../utils/deployment.utils'
import { IstioDeploymentManifestsUtils } from '../utils/istio-deployment-manifests.utils'
import { IstioUndeploymentManifestsUtils } from '../utils/istio-undeployment-manifests.utils'
import { HelmConfig, HelmRepositoryConfig } from './interfaces/helm-config.interface'
import { OctopipeDeployment, OctopipeDeploymentRequest } from './interfaces/octopipe-deployment.interface'
import {
  ClusterProviderEnum,
  IEKSClusterConfig,
  IGenericClusterConfig
} from './interfaces/octopipe-payload.interface'
import { OctopipeUndeployment, OctopipeUndeploymentRequest } from './interfaces/octopipe-undeployment.interface'

export class OctopipeRequestBuilder {

  public buildDeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): OctopipeDeploymentRequest {

    return {
      namespace: (deployment.cdConfiguration?.configurationData as OctopipeConfigurationData).namespace,
      deployments: this.getDeploymentsArray(deployment, activeComponents),
      unusedDeployments: this.getUnusedDeploymentsArray(deployment, activeComponents),
      proxyDeployments: this.getProxyDeploymentsArray(deployment, activeComponents),
      callbackUrl: UrlUtils.getDeploymentNotificationUrl(configuration.executionId),
      clusterConfig: this.getClusterConfig(deployment.cdConfiguration.configurationData as OctopipeConfigurationData),
      unusedProxyDeployments: this.overrideUnusedRules(deployment, activeComponents)
    }
  }

  public buildUndeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): OctopipeUndeploymentRequest {

    return {
      namespace: (deployment.cdConfiguration?.configurationData as OctopipeConfigurationData).namespace,
      undeployments: this.getUndeploymentsArray(deployment),
      proxyDeployments: this.getProxyUndeploymentsArray(deployment, activeComponents),
      callbackUrl: UrlUtils.getDeploymentNotificationUrl(configuration.executionId),
      clusterConfig: this.getClusterConfig(deployment.cdConfiguration.configurationData as OctopipeConfigurationData)
    }
  }

  private getDeploymentsArray(deployment: Deployment, activeComponents: Component[]): OctopipeDeployment[] {
    if (!deployment?.components) {
      return []
    }
    return deployment.components.map(component => ({
      componentName: component.name,
      helmRepositoryConfig: this.getHelmRepositoryConfig(component, deployment.cdConfiguration),
      helmConfig: this.getHelmConfig(component, deployment.circleId),
      rollbackIfFailed: !DeploymentUtils.getActiveSameCircleTagComponent(activeComponents, component, deployment.circleId)
    }))
  }

  private getProxyDeploymentsArray(deployment: Deployment, activeComponents: Component[]): K8sManifest[] {
    if (!deployment?.components) {
      return []
    }
    const proxyDeployments: K8sManifest[] = []
    deployment.components.forEach(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      proxyDeployments.push(IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, component, activeByName))
      proxyDeployments.push(IstioDeploymentManifestsUtils.getVirtualServiceManifest(deployment, component, activeByName))
    })
    return proxyDeployments
  }

  private getUndeploymentsArray(deployment: Deployment): OctopipeUndeployment[] {
    if (!deployment?.components) {
      return []
    }
    return deployment.components.map(component => ({ //TODO improve this object later - It shouldnt be equal to the deployment object
      componentName: component.name,
      helmRepositoryConfig: this.getHelmRepositoryConfig(component, deployment.cdConfiguration),
      helmConfig: this.getHelmConfig(component, deployment.circleId),
      rollbackIfFailed: false
    }))
  }

  private getProxyUndeploymentsArray(deployment: Deployment, activeComponents: Component[]): K8sManifest[] {
    if (!deployment?.components) {
      return []
    }
    const proxyUndeployments: K8sManifest[] = []
    deployment.components.forEach(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      proxyUndeployments.push(IstioUndeploymentManifestsUtils.getDestinationRulesManifest(deployment, component, activeByName))
      proxyUndeployments.push(activeByName.length > 1 ?
        IstioUndeploymentManifestsUtils.getVirtualServiceManifest(deployment, component, activeByName) :
        IstioUndeploymentManifestsUtils.getEmptyVirtualServiceManifest(deployment, component)
      )
    })
    return proxyUndeployments
  }

  private getUnusedDeploymentsArray(deployment: Deployment, activeComponents: Component[]): OctopipeDeployment[] {
    return deployment.defaultCircle ?
      this.defaultUnusedVersions(deployment, activeComponents) :
      this.circleUnusedVersions(deployment, activeComponents)

  }
  private defaultUnusedVersions(deployment: Deployment, activeComponents: Component[]): OctopipeDeployment[] {
    if (!deployment?.components) {
      return []
    }

    const unusedDeployments: OctopipeDeployment[] = []
    deployment.components.forEach(component => {
      const unusedComponent: Component | undefined = DeploymentUtils.getUnusedComponent(activeComponents, component, deployment.circleId)
      if (unusedComponent) {
        unusedDeployments.push({ //TODO improve this object later - It shouldnt be equal to the deployment object
          componentName: unusedComponent.name,
          helmRepositoryConfig: this.getHelmRepositoryConfig(unusedComponent, deployment.cdConfiguration),
          helmConfig: this.getHelmConfig(unusedComponent, deployment.circleId),
          rollbackIfFailed: false
        })
      }
    })
    return unusedDeployments

  }

  private circleUnusedVersions(deployment: Deployment, activeComponents: Component[]) {
    if (!deployment?.components) {
      return []
    }

    return componentsToBeRemoved(deployment, activeComponents).map(component => {
      return {
        componentName: component.name,
        helmRepositoryConfig: this.getHelmRepositoryConfig(component, deployment.cdConfiguration),
        helmConfig: this.getHelmConfig(component, deployment.circleId),
        rollbackIfFailed: false
      }
    })
  }

  private overrideUnusedRules(deployment: Deployment, activeComponents: Component[]) {
    if (!deployment.components) {
      return []
    }

    if (deployment.defaultCircle) {
      return []
    }

    const proxyUndeployments: K8sManifest[] = []
    const unused = unusedComponentProxy(deployment, activeComponents)
    unused.forEach(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      proxyUndeployments.push(IstioUndeploymentManifestsUtils.getDestinationRulesManifest(deployment, component, activeByName))
      proxyUndeployments.push(activeByName.length > 1 ?
        IstioUndeploymentManifestsUtils.getVirtualServiceManifest(deployment, component, activeByName) :
        IstioUndeploymentManifestsUtils.getEmptyVirtualServiceManifest(deployment, component)
      )
    })
    return proxyUndeployments
  }

  private getHelmRepositoryConfig(component: DeploymentComponent, cdConfiguration: CdConfiguration): HelmRepositoryConfig {
    return {
      type: (cdConfiguration.configurationData as OctopipeConfigurationData).gitProvider,
      url: component.helmUrl,
      token: (cdConfiguration.configurationData as OctopipeConfigurationData).gitToken
    }
  }

  private getHelmConfig(component: DeploymentComponent, circleId: string ): HelmConfig {
    return {
      overrideValues: {
        'image.tag': component.imageUrl,
        deploymentName: CommonTemplateUtils.getDeploymentName(component, circleId),
        component: component.name,
        tag: component.imageTag,
        circleId: circleId
      }
    }
  }

  private getClusterConfig(configuration: OctopipeConfigurationData): IEKSClusterConfig | IGenericClusterConfig | null {
    switch (configuration.provider) {
      case ClusterProviderEnum.EKS:
        return {
          provider: ClusterProviderEnum.EKS,
          awsSID: configuration.awsSID,
          awsSecret: configuration.awsSecret,
          awsRegion: configuration.awsRegion,
          awsClusterName: configuration.awsClusterName
        }
      case ClusterProviderEnum.GENERIC:
        return {
          provider: ClusterProviderEnum.GENERIC,
          clientCertificate: configuration.clientCertificate,
          caData: configuration.caData,
          clientKey: configuration.clientKey,
          host: configuration.host
        }
      default:
        return null
    }
  }
}
