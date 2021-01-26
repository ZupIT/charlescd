import { CdConfigurationEntity } from '../../../../app/v2/api/configurations/entity/cd-configuration.entity'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums/cd-type.enum'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces/git-providers.type'
import { ClusterProviderEnum } from '../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { unusedComponentProxy } from '../../../../app/v2/core/integrations/utils/deployment.utils'

it('should perform a proxy deployment on cleanup to remove unused components proxies', async() => {
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

  let activeOnCircle = [
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'https://repository.com/A:v1',
      'component-a',
      'component-a-id-1',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'https://repository.com/B:v1',
      'component-b',
      'component-b-id-2',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/C:v2',
      'component-c',
      'component-c-id-33',
      null,
      null
    )
  ]

  let activeOnDefault = [
    new ComponentEntityV2(
      'helm.url',
      'v0',
      'https://repository.com/A:v0',
      'component-a',
      'component-a-id-3',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v0',
      'https://repository.com/B:v0',
      'component-b',
      'component-b-id-4',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v0',
      'https://repository.com/C:v0',
      'component-c',
      'component-c-id-5',
      null,
      null
    )
  ]

  const activeComponents = activeOnDefault.concat(activeOnCircle)

  const circleDeployments = new DeploymentEntityV2(
    'deployment-id',
    'author-id',
    'circle-id',
    cdConfiguration,
    'www.callback.com',
    activeOnCircle,
    false
  )
  const defaultDeployment = new DeploymentEntityV2(
    'deployment-id-2',
    'author-id',
    'default-circle-id',
    cdConfiguration,
    'www.callback.com',
    activeOnDefault,
    true
  )

  activeOnDefault = activeOnDefault.map(c => {
    c.deployment = defaultDeployment
    return c
  })

  activeOnCircle = activeOnCircle.map(c => {
    c.deployment = circleDeployments
    return c
  })

  let newComponents = [
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/A:v2',
      'component-a',
      'component-a-id-11',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/B:v2',
      'component-b',
      'component-b-id-22',
      null,
      null
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/C:v2',
      'component-c',
      'component-c-id-33',
      null,
      null
    )
  ]

  const newDeployment = new DeploymentEntityV2(
    'new-deployment-id',
    'author-id',
    'circle-id',
    cdConfiguration,
    'www.callback.com',
    newComponents,
    false
  )

  newComponents = newComponents.map(c => {
    c.deployment = newDeployment
    return c
  })

  const removedVersions = unusedComponentProxy(newDeployment, activeComponents)
  expect(removedVersions.map(c => c.name)).toEqual(['component-c'])
})

it('should not perform cleanup when no components where overriden', () => {
  const activeComponents = [
    {
      id: 'component-id-6',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/A:v0',
      name: 'A',
      running: true,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id6',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
        circleId: 'circle-id',
        defaultCircle: false,
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
      }
    }
  ]

  const deployment = {
    id: 'deployment-id',
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
    circleId: 'circle-id',
    defaultCircle: false,
    createdAt: new Date(),
    components: [
      {
        id: 'component-id-1',
        helmUrl: 'http://localhost:2222/helm',
        imageTag: 'v2',
        imageUrl: 'https://repository.com/A:v2',
        name: 'A',
        running: false,
        gatewayName: null,
        hostValue: null
      }
    ]
  }

  const removedVersions = unusedComponentProxy(deployment, activeComponents)
  expect(removedVersions).toEqual([])

})


// active{
//   circle{
//     a:v1
//     b:v1
//     c:v2
//   }
//   default{
//     a:v0
//     b:v0
//     c:v0
//   }
// }

// request{
//   a:v2
//   b:v2
//   d:v2
// }



// expected-undeploy-proxy{
//   c < has to keep c:v0 on default but remove c:v2 from circle
// }
