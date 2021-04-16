import { ComponentEntityV2 } from '../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../app/v2/api/deployments/entity/deployment.entity'
import { getComplexManifests, getSimpleManifests } from './manifests.fixture'
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

export const deploymentFixture2 = new DeploymentEntityV2(
  'a62ce3b9-3029-42a8-9153-ace7a4d632bf',
  'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
  'b46fd548-0082-4021-ba80-a50703c44a3b',
  UrlConstants.deploymentCallbackUrl,
  [
    new ComponentEntityV2(
      UrlConstants.helmRepository,
      'build-image-tag2',
      'build-image-url2.com',
      'hello-kubernetes',
      'a9c654e2-245e-4c2f-8b31-e3fd81e4a5b3',
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
    withManifests? getSimpleManifests(name, namespace, 'image-url') : [],
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
        withManifests? getSimpleManifests(name, namespace, 'image-url') : [],
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

export const getDeploymentWithManifestFixture = (simpleManifests: boolean): DeploymentEntityV2 => {
  const deployment = new DeploymentEntityV2(
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
        simpleManifests ?
          getSimpleManifests('hello-kubernetes', 'namespace', 'build-image-url.com') :
          getComplexManifests('hello-kubernetes', 'namespace', 'build-image-url.com'),
        false
      )
    ],
    true,
    'namespace',
    60
  )
  return deployment
}

export const getDeploymentWithManifestAndPreviousFixture = (simpleManifests: boolean): DeploymentEntityV2 => {
  const deployment = new DeploymentEntityV2(
    'e728a072-b0aa-4459-88ba-0f4a9b71ae54',
    'b8ccdabf-6094-495c-b44e-ba8ea2214e29',
    'b46fd548-0082-4021-ba80-a50703c44a3b',
    UrlConstants.deploymentCallbackUrl,
    [
      new ComponentEntityV2(
        UrlConstants.helmRepository,
        'build-image-tag-2',
        'build-image-url-2.com',
        'hello-kubernetes',
        'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
        null,
        null,
        simpleManifests ?
          getSimpleManifests('hello-kubernetes', 'namespace', 'build-image-url-2.com') :
          getComplexManifests('hello-kubernetes', 'namespace', 'build-image-url-2.com'),
        false
      )
    ],
    true,
    'namespace',
    60
  )
  const previousDeployment = getDeploymentWithManifestFixture(simpleManifests)
  deployment.previousDeploymentId = previousDeployment.id
  return deployment
}