import { IstioDeploymentManifestsUtils } from '../../../../app/v2/core/integrations/utils/istio-deployment-manifests.utils'
import { Component } from '../../../../app/v2/api/deployments/interfaces'
import { twoSubsetsDr } from './fixtures/deployment/two-subsets-dr'

it('should generate the correct destination rules manifest with one circle and one default circle subset', () => {
  const activeByName: Component[] = [
    {
      id: 'component-id',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id1',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
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
    IstioDeploymentManifestsUtils.getDestinationRulesManifest('A', 'sandbox', activeByName)
  ).toEqual(twoSubsetsDr)
})

// TODO generate destination rules with empty subsets

// TODO generate correct virtual services

// TODO generate virtual services with empty rules