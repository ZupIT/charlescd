import { IstioDeploymentManifestsUtils } from '../../../../app/v2/core/integrations/utils/istio-deployment-manifests.utils'
import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { DeploymentComponent } from '../../../../app/v2/api/deployments/interfaces/deployment.interface'
import { noRepeatedDefaultCircleDr } from './fixtures/deployment/no-repeated-default-circle-dr'
import { noRepeatedCircleDr } from './fixtures/deployment/no-repeated-circle-dr'

it('must not insert two default circle subsets', () => {
  const newComponent: DeploymentComponent = {
    id: 'component-id',
    helmUrl: 'http://localhost:2222/helm',
    imageTag: 'v1',
    imageUrl: 'https://repository.com/A:v1',
    name: 'A',
    running: false,
    gatewayName: null,
    hostValue: null
  }
  const deployment: Deployment = {
    id: 'deployment-id',
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    namespace: 'sandbox',
    circleId: 'default-circle-id',
    defaultCircle: true,
    createdAt: new Date(),
    components: [
      newComponent
    ]
  }
  const activeByName: Component[] = [
    {
      id: 'component-id2',
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
        namespace: 'sandbox',
        defaultCircle: true
      }
    },
    {
      id: 'component-id3',
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
        namespace: 'sandbox',
        defaultCircle: false
      }
    }
  ]

  expect(
    IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
  ).toEqual(noRepeatedDefaultCircleDr)
})

it('must not insert two subsets for the same circle', () => {
  const newComponent: DeploymentComponent = {
    id: 'component-id',
    helmUrl: 'http://localhost:2222/helm',
    imageTag: 'v1',
    imageUrl: 'https://repository.com/A:v1',
    name: 'A',
    running: false,
    gatewayName: null,
    hostValue: null
  }
  const deployment: Deployment = {
    id: 'deployment-id',
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    namespace: 'sandbox',
    circleId: 'normal-circle-id',
    defaultCircle: true,
    createdAt: new Date(),
    components: [
      newComponent
    ]
  }
  const activeByName: Component[] = [
    {
      id: 'component-id3',
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
        namespace: 'sandbox',
        defaultCircle: true
      }
    },
    {
      id: 'component-id4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v3',
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
        namespace: 'sandbox',
        defaultCircle: false
      }
    }
  ]

  expect(
    IstioDeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
  ).toEqual(noRepeatedCircleDr)
})
