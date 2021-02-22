import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums'
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
    cdConfiguration: {
      id: 'cd-configuration-id',
      type: CdTypeEnum.SPINNAKER,
      configurationData: {
        gitAccount: 'github-artifact',
        account: 'default',
        namespace: 'sandbox',
        url: 'spinnaker-url'
      },
      name: 'spinnakerconfiguration',
      authorId: 'user-2',
      workspaceId: 'workspace-id',
      createdAt: new Date(),
      deployments: null
    },
    circleId: 'default-circle-id',
    defaultCircle: true,
    metadata: null,
    createdAt: new Date(),
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
        metadata: null,
        createdAt: new Date(),
        cdConfiguration: {
          id: 'cd-configuration-id',
          type: CdTypeEnum.SPINNAKER,
          configurationData: {
            gitAccount: 'github-artifact',
            account: 'default',
            namespace: 'sandbox',
            url: 'spinnaker-url'
          },
          name: 'spinnakerconfiguration',
          authorId: 'user-2',
          workspaceId: 'workspace-id',
          createdAt: new Date(),
          deployments: null
        },
        defaultCircle: true
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
        metadata: null,
        createdAt: new Date(),
        cdConfiguration: {
          id: 'cd-configuration-id',
          type: CdTypeEnum.SPINNAKER,
          configurationData: {
            gitAccount: 'github-artifact',
            account: 'default',
            namespace: 'sandbox',
            url: 'spinnaker-url'
          },
          name: 'spinnakerconfiguration',
          authorId: 'user-2',
          workspaceId: 'workspace-id',
          createdAt: new Date(),
          deployments: null
        },
        defaultCircle: false
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
    cdConfiguration: {
      id: 'cd-configuration-id',
      type: CdTypeEnum.SPINNAKER,
      configurationData: {
        gitAccount: 'github-artifact',
        account: 'default',
        namespace: 'sandbox',
        url: 'spinnaker-url'
      },
      name: 'spinnakerconfiguration',
      authorId: 'user-2',
      workspaceId: 'workspace-id',
      createdAt: new Date(),
      deployments: null
    },
    circleId: 'normal-circle-id',
    defaultCircle: true,
    metadata: null,
    createdAt: new Date(),
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
        cdConfiguration: {
          id: 'cd-configuration-id',
          type: CdTypeEnum.SPINNAKER,
          configurationData: {
            gitAccount: 'github-artifact',
            account: 'default',
            namespace: 'sandbox',
            url: 'spinnaker-url'
          },
          name: 'spinnakerconfiguration',
          authorId: 'user-2',
          workspaceId: 'workspace-id',
          createdAt: new Date(),
          deployments: null
        },
        defaultCircle: true,
        metadata: null
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
        cdConfiguration: {
          id: 'cd-configuration-id',
          type: CdTypeEnum.SPINNAKER,
          configurationData: {
            gitAccount: 'github-artifact',
            account: 'default',
            namespace: 'sandbox',
            url: 'spinnaker-url'
          },
          name: 'spinnakerconfiguration',
          authorId: 'user-2',
          workspaceId: 'workspace-id',
          createdAt: new Date(),
          deployments: null
        },
        defaultCircle: false,
        metadata: null
      }
    }
  ]

  expect(
    IstioUndeploymentManifestsUtils.getDestinationRulesManifest(deployment, newComponent, activeByName)
  ).toEqual(noRepeatedUndeploymentCircleDr)
})
