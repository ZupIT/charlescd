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

export const componentsFixtureCircle1WithService = [
  createDeployComponent('A', 'v1', 'circle-1', true, true, 'namespace')
]

export const componentsFixtureCircle1DiffNamespace = [
  createDeployComponent('A', 'v1', 'circle-1', true, false, 'diff-namespace')
]

export const componentsFixtureCircle1 = [
  createDeployComponent('A', 'v1', 'circle-1', true, false, 'namespace')
]

export const componentsFixtureCircle2 = [
  createDeployComponent('A', 'v2', 'circle-2', false, false, 'namespace'),
  createDeployComponent('B', 'v2', 'circle-2', false, false, 'namespace')
]

function createDeployComponent(
  name: string,
  tag: string,
  circle: string,
  defaultCircle: boolean,
  withManifests: boolean,
  namespace: string
) {
  const component = new ComponentEntityV2(
    UrlConstants.helmRepository,
    tag,
    'build-image-url.com',
    name,
    'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
    null,
    null,
    withManifests? customManifests(name, namespace, 'image-url') : [],
    false
  )

  component.deployment = new DeploymentEntityV2(
    'b7d08a07-f29d-452e-a667-7a39820f3262',
    'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
    circle,
    UrlConstants.deploymentCallbackUrl,
    [
      new ComponentEntityV2(
        UrlConstants.helmRepository,
        tag,
        'build-image-url.com',
        name,
        'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
        null,
        null,
        withManifests? customManifests(name, namespace, 'image-url') : [],
        false
      )
    ],
    defaultCircle,
    namespace,
    60
  )
  component.deployment.createdAt = new Date()

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
