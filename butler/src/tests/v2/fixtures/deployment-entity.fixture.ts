import { CdConfigurationEntity } from '../../../app/v2/api/configurations/entity'
import { CdTypeEnum } from '../../../app/v2/api/configurations/enums'
import { ComponentEntityV2 } from '../../../app/v2/api/deployments/entity/component.entity'
import { GitProvidersEnum } from '../../../app/v2/core/configuration/interfaces'
import { ClusterProviderEnum } from '../../../app/v2/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { DeploymentEntityV2 } from '../../../app/v2/api/deployments/entity/deployment.entity'
import { customManifests } from './manifests.fixture'
import { UrlConstants } from '../integration/test-constants'

export const cdConfigurationFixture = new CdConfigurationEntity(
  CdTypeEnum.OCTOPIPE,
  {
    gitProvider: GitProvidersEnum.GITHUB,
    gitToken: 'git-token',
    provider: ClusterProviderEnum.DEFAULT,
    namespace: 'namespace',
  },
  'config-name',
  'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  '33491750-094e-4c25-8a96-1e704e682d7e',
)

export const deploymentFixture = new DeploymentEntityV2(
  'b7d08a07-f29d-452e-a667-7a39820f3262',
  'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  'b46fd548-0082-4021-ba80-a50703c44a3b',
  cdConfigurationFixture,
  UrlConstants.deploymentCallbackUrl,
  [
    new ComponentEntityV2(
      UrlConstants.helmRepository,
      'build-image-tag',
      'build-image-url.com',
      'hello-kubernetes',
      'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
      null,
      null,
      [],
      false
    )
  ],
  true,
)

export const deployComponentsFixture = [createDeployComponent()]

function createDeployComponent() {
  const component = new ComponentEntityV2(
    UrlConstants.helmRepository,
    'build-image-tag',
    'build-image-url.com',
    'hello-kubernetes',
    'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
    null,
    null,
    [],
    false
  )

  component.deployment = new DeploymentEntityV2(
    'b7d08a07-f29d-452e-a667-7a39820f3262',
    'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
    'b46fd548-0082-4021-ba80-a50703c44a3b',
    cdConfigurationFixture,
    UrlConstants.deploymentCallbackUrl,
    [
      new ComponentEntityV2(
        UrlConstants.helmRepository,
        'build-image-tag',
        'build-image-url.com',
        'hello-kubernetes',
        'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
        null,
        null,
        [],
        false
      )
    ],
    true,
  )
  return component
}

export const deploymentWithManifestFixture = new DeploymentEntityV2(
  'b7d08a07-f29d-452e-a667-7a39820f3262',
  'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  'b46fd548-0082-4021-ba80-a50703c44a3b',
  cdConfigurationFixture,
  UrlConstants.deploymentCallbackUrl,
  [
    new ComponentEntityV2(
      UrlConstants.helmRepository,
      'build-image-tag',
      'build-image-url.com',
      'hello-kubernetes',
      'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
      null,
      null,
      customManifests('hello-kubernetes', 'namespace', 'build-image-tag'),
      false
    )
  ],
  true,
)
