import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { componentsToBeRemoved } from '../../../../app/v2/core/integrations/utils/deployment.utils'

it('new deployment with active components on default circle', async() => {

  let activeOnCircle = [
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'https://repository.com/A:v1',
      'component-a',
      'component-a-id-1',
      null,
      null,
      []
    ),
    new ComponentEntityV2(
      'helm.url',
      'v1',
      'https://repository.com/B:v1',
      'component-b',
      'component-b-id-2',
      null,
      null,
      []
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/C:v2',
      'component-c',
      'component-c-id-33',
      null,
      null,
      []
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
      null,
      []
    ),
    new ComponentEntityV2(
      'helm.url',
      'v0',
      'https://repository.com/B:v0',
      'component-b',
      'component-b-id-4',
      null,
      null,
      []
    ),
    new ComponentEntityV2(
      'helm.url',
      'v0',
      'https://repository.com/C:v0',
      'component-c',
      'component-c-id-5',
      null,
      null,
      []
    )
  ]

  const activeComponents = activeOnDefault.concat(activeOnCircle)

  const circleDeployments = new DeploymentEntityV2(
    'deployment-id',
    'author-id',
    'circle-id',
    'www.callback.com',
    activeOnCircle,
    false,
    'default'
  )
  const defaultDeployment = new DeploymentEntityV2(
    'deployment-id-2',
    'author-id',
    'default-circle-id',
    'www.callback.com',
    activeOnDefault,
    true,
    'default'
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
      null,
      []
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/B:v2',
      'component-b',
      'component-b-id-22',
      null,
      null,
      []
    ),
    new ComponentEntityV2(
      'helm.url',
      'v2',
      'https://repository.com/C:v2',
      'component-c',
      'component-c-id-33',
      null,
      null,
      []
    )
  ]

  const newDeployment = new DeploymentEntityV2(
    'new-deployment-id',
    'author-id',
    'circle-id',
    'www.callback.com',
    newComponents,
    false,
    'default'
  )

  newComponents = newComponents.map(c => {
    c.deployment = newDeployment
    return c
  })

  const removedVersions = componentsToBeRemoved(newDeployment, activeComponents)
  expect(removedVersions.map(c => c.imageUrl)).toEqual(['https://repository.com/A:v1', 'https://repository.com/B:v1'])
})
