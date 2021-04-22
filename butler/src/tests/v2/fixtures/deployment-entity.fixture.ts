import { ComponentEntityV2 } from '../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../app/v2/api/deployments/entity/deployment.entity'
import { getComplexManifests, getNoLabelsManifests, getSimpleManifests } from './manifests.fixture'
import { UrlConstants } from '../integration/test-constants'
import { KubernetesManifest } from '../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'

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

type ManifestType = 'simple' | 'complex' | 'noLabels' | 'noManifest'

const getManifests = (
  manifestType: ManifestType,
  name: string,
  image: string,
  namespace: string
): KubernetesManifest[] => {
  let manifests: KubernetesManifest[]
  switch (manifestType) {
    case 'simple':
      manifests = getSimpleManifests(name, namespace, image)
      break
    case 'complex':
      manifests = getComplexManifests(name, namespace, image)
      break
    case 'noLabels':
      manifests = getNoLabelsManifests(name, image)
      break
    case 'noManifest':
      manifests = []
      break
    default:
      throw Error('Invalid manifest type')
  }
  return manifests
}

export const createDeployComponent = (
  name: string,
  tag: string,
  circle: string,
  defaultCircle: boolean,
  manifestType: ManifestType,
  namespace: string,
  isDeploymentHealthy: boolean
) => {
  const component = new ComponentEntityV2(
    UrlConstants.helmRepository,
    tag,
    'build-image-url.com',
    name,
    'e82f9bbb-169b-4b11-b48f-7f4fc7561651',
    null,
    null,
    getManifests(manifestType, name, 'build-image-url.com', namespace),
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
        getManifests(manifestType, name, 'build-image-url.com', namespace),
        false
      )
    ],
    defaultCircle,
    namespace,
    60
  )
  component.deployment.createdAt = new Date()
  component.deployment.healthy = isDeploymentHealthy

  return component
}

export const getDeploymentWithManifestFixture = (manifestType: ManifestType): DeploymentEntityV2 => {
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
        getManifests(manifestType, 'hello-kubernetes', 'build-image-url.com', 'namespace'),
        false
      )
    ],
    true,
    'namespace',
    60
  )
  return deployment
}

export const getDeploymentWithManifestAndPreviousFixture = (manifestType: ManifestType): DeploymentEntityV2 => {
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
        getManifests(manifestType, 'hello-kubernetes', 'build-image-url-2.com', 'namespace'),
        false
      )
    ],
    true,
    'namespace',
    60
  )
  const previousDeployment = getDeploymentWithManifestFixture(manifestType)
  deployment.previousDeploymentId = previousDeployment.id
  return deployment
}