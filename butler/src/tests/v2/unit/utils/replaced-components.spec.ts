import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { GitProvidersEnum } from '../../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { componentsToBeRemoved } from '../../../../app/v2/core/integrations/utils/deployment.utils'

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

  const removedVersions = componentsToBeRemoved(deployment, activeComponents)
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
  expect(removedVersions.map((c) => {
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
