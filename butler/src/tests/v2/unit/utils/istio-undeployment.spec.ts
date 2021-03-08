import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { DeploymentComponent } from '../../../../app/v2/api/deployments/interfaces/deployment.interface'
import { IstioUndeploymentManifestsUtils } from '../../../../app/v2/core/integrations/utils/istio-undeployment-manifests.utils'
import { noRepeatedUndeploymentCircleDr } from './fixtures/undeployment/no-repeated-undeployment-circle-dr'
import { noRepeatedUndeploymentDefaultCircleDr } from './fixtures/undeployment/no-repeated-undeployment-default-circle-dr'

it('must not insert two default circle subsets', () => {
  const newComponent: DeploymentComponent = {
    id: 'component-id0',
    helmUrl: 'http://localhost:2222/helm',
    imageTag: 'v1',
    imageUrl: 'https://repository.com/A:v1',
    name: 'A',
    running: false,
    gatewayName: null,
    hostValue: null
  }
  const deployment: Deployment = {
    id: 'deployment-id0',
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    circleId: 'default-circle-id',
    defaultCircle: true,
    createdAt: new Date(),
    namespace: 'sandbox',
    components: [
      newComponent
    ]
  }
  const activeByName: Component[] = [
    {
      id: 'component-id0',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/A:v2',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id2',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
        circleId: 'default-circle-id',
        createdAt: new Date(),
        defaultCircle: true,
        namespace: 'sandbox'
      }
    },
    {
      id: 'component-id1',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
        circleId: 'normal-circle-id',
        createdAt: new Date(),
        defaultCircle: false,
        namespace: 'sandbox'
      }
    }
  ]

  expect(
    IstioUndeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
  ).toEqual(noRepeatedUndeploymentDefaultCircleDr)
})

it('must not insert two subsets for the same circle', () => {
  const newComponent: DeploymentComponent = {
    id: 'component-id1',
    helmUrl: 'http://localhost:2222/helm',
    imageTag: 'v1',
    imageUrl: 'https://repository.com/A:v1',
    name: 'A',
    running: false,
    gatewayName: null,
    hostValue: null
  }
  const deployment: Deployment = {
    id: 'deployment-id1',
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    circleId: 'normal-circle-id',
    defaultCircle: true,
    createdAt: new Date(),
    namespace: 'sandbox',
    components: [
      newComponent
    ]
  }
  const activeByName: Component[] = [
    {
      id: 'component-id1',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/A:v2',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id2',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
        circleId: 'default-circle-id',
        createdAt: new Date(),
        defaultCircle: true,
        namespace: 'sandbox'
      }
    },
    {
      id: 'component-id2',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
        circleId: 'normal-circle-id',
        createdAt: new Date(),
        defaultCircle: false,
        namespace: 'sandbox'
      }
    }
  ]

  expect(
    IstioUndeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
  ).toEqual(noRepeatedUndeploymentCircleDr)
})
