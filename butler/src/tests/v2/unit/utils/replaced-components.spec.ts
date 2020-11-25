// circulo 1:
// Componentes: A:v1, B:v1, C:v1

// Componentes: A:v1, B:v2
// B:v1, C:v1

import { flatMap, uniq, uniqBy } from 'lodash'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { GitProvidersEnum } from '../../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Component } from '../../../../app/v2/api/deployments/interfaces/component.interface'
import { Deployment, DeploymentComponent } from '../../../../app/v2/api/deployments/interfaces/deployment.interface'
import { OctopipeDeployment } from '../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-deployment.interface'

it('must replace new components version', async() => {
  const cdConfiguration = new CdConfigurationEntity(
    CdTypeEnum.OCTOPIPE,
    {
      provider: ClusterProviderEnum.DEFAULT,
      gitProvider: GitProvidersEnum.GITHUB,
      gitToken: '123',
      namespace: 'default'
    },
    'some-config',
    'author-id',
    'workspace-id'
  )
  let activeComponents = [
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'A:v1',
      'component-a',
      'component-a-id',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'B:v1',
      'component-b',
      'component-b-id',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'C:v1',
      'component-c',
      'component-c-id',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'D:v1',
      'component-d',
      'component-d-id',
      null,
      null
    )
  ]
  const components = [
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'A:v1',
      'component-a',
      'component-a-id',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'B:v2',
      'component-b',
      'component-b-id',
      null,
      null
    )
  ]
  const deployment = new DeploymentEntityV2(
    'deployment-id',
    'author-id',
    'circle-id',
    cdConfiguration,
    'www.callback.com',
    components,
    false
  )

  activeComponents = activeComponents.map(c => {
    c.deployment = deployment
    return c
  })

  const replacedVersions = replaceVersions(deployment, activeComponents)
  const expectedComponents = [
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'B:v1',
      'component-b',
      'component-b-id',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'C:v1',
      'component-c',
      'component-c-id',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'D:v1',
      'component-d',
      'component-d-id',
      null,
      null
    )
  ]
  expect(replacedVersions.map((c) => {
    return {
      name: c.name,
      imageUrl: c.imageUrl
    }
  })).toEqual(expectedComponents.map(c => {
    return {
      name: c.name,
      imageUrl: c.imageUrl
    }
  }))
})




const replaceVersions = (deployment: Deployment, activeComponents: Component[]): DeploymentComponent[] => {
  const circleId = deployment.circleId
  return activeComponents.filter(c => {
    return non(deployment.components, c, circleId) || updated(deployment.components, c, circleId)
    return !deployment.components?.some(dc => nonExistendConditions(dc, c, circleId)) || deployment.components?.some(dc => oldVersionCondition(dc, c, circleId))
  })
  const removedComponents = activeComponents.filter(c => !deployment.components?.some(dc => nonExistendConditions(dc, c, circleId)))
  const updatedComponents = activeComponents.filter(c => deployment.components?.some(dc => oldVersionCondition(dc, c, circleId)))
  return updatedComponents.concat(removedComponents)
}

const non = (deploymentComponents: DeploymentComponent[] | undefined, activeComponent: Component, circleId: string) => {
  return !deploymentComponents?.some(dc => nonExistendConditions(dc, activeComponent, circleId))
}

const updated = (deploymentComponents: DeploymentComponent[] | undefined, activeComponent: Component, circleId: string) => {
  return deploymentComponents?.some(dc => oldVersionCondition(dc, activeComponent, circleId))
}

const nonExistendConditions = (deploymentComponent: DeploymentComponent, activeComponent: Component, circleId: string): boolean => {
  return isSameName(deploymentComponent, activeComponent) && isSameCircle(circleId, activeComponent.deployment)
}

const oldVersionCondition = (deploymentComponent: DeploymentComponent, activeComponent: Component, circleId: string): boolean => {
  return isSameNameAndDifferenteVersion(deploymentComponent, activeComponent) && isSameCircle(circleId, activeComponent.deployment)
}

const isSameNameAndDifferenteVersion = (deploymentComponent: DeploymentComponent, activeComponent: Component): boolean => {
  return isSameName(deploymentComponent, activeComponent) && deploymentComponent.imageUrl !== activeComponent.imageUrl
}

const isSameName = (deploymentComponent: DeploymentComponent, activeComponent: Component): boolean => {
  return deploymentComponent.name === activeComponent.name
}

const isSameCircle = (circleId: string, deployment: Deployment): boolean => {
  return circleId === deployment.circleId
}


