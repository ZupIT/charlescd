import { ComponentEntityV2 } from '../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../app/v2/api/deployments/entity/deployment.entity'
import { customManifests } from './manifests.fixture'
import { UrlConstants } from '../integration/test-constants'

export const deploymentFixture = new DeploymentEntityV2(
  'b7d08a07-f29d-452e-a667-7a39820f3262',
  'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  'b46fd548-0082-4021-ba80-a50703c44a3b',
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
  'namespace',
  60
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
    'namespace',
    60
  )
  return component
}

export const deploymentWithManifestFixture = new DeploymentEntityV2(
  'b7d08a07-f29d-452e-a667-7a39820f3262',
  'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  'b46fd548-0082-4021-ba80-a50703c44a3b',
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
  'namespace',
  60
)
