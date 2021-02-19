import 'jest'
import { CdConfigurationEntity } from '../../../../app/v2/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces/git-providers.type'
import { ClusterProviderEnum } from '../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { Reconcile } from '../../../../app/v2/operator/reconcile'
import { reconcileFixtures, reconcileFixturesParams } from './params'

describe('Deployment on existing circle', () => {

  it('returns empty array for the first reconcile loop on same circle that already had deployments', () => {
    const params = reconcileFixturesParams.paramsWithPreviousDeployment
    const currentDeployment = reconcileFixtures.currentDeploymentId
    const reconcile = new Reconcile()
    expect(reconcile.specsByDeployment(params, currentDeployment)).toEqual([])
  })

  it('returns list of previous deployment specs', () => {
    const params = reconcileFixturesParams.paramsWithPreviousDeployment
    const previousDeployment = reconcileFixtures.previousDeploymentId
    const reconcile = new Reconcile()
    const ids = reconcile.specsByDeployment(params, previousDeployment).map(s => s.metadata.labels.deployment_id)
    expect(ids).toEqual([previousDeployment, previousDeployment])
  })

  it('returns false if current deployments specs are not ready but previous deployments are still running', () => {
    const params = reconcileFixturesParams.paramsWithPreviousDeployment
    const previousDeployment = reconcileFixtures.previousDeploymentId
    const currentDeployment = reconcileFixtures.currentDeploymentId
    const reconcile = new Reconcile()
    const currentSpecs = reconcile.specsByDeployment(params, currentDeployment)
    const previousSpecs = reconcile.specsByDeployment(params, previousDeployment)
    expect(reconcile.checkConditions(currentSpecs)).toEqual(false)
    expect(reconcile.checkConditions(previousSpecs)).toEqual(true)
  })

  it('concatenates deployments and services from previous and current deployment', () => {
    const reconcile = new Reconcile()
    const cdConfig = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'my-config',
      'some-author',
      'some-id')
    const previousComponents = [
      new ComponentEntityV2(
        'http://localhost:8883/repos/charlescd-fake/helm-chart',
        'v1',
        'https://repository.com/B:v1',
        'B',
        '1c29210c-e313-4447-80e3-db89b2359138',
        null,
        null,
        [
          {
            kind: 'Deployment',
            metadata: {
              name: 'batata'
            }
          },
          {
            kind: 'Service',
            metadata: {
              name: 'batata'
            }
          },
          {
            kind: 'Deployment',
            metadata: {
              name: 'jilo'
            }
          },
          {
            kind: 'Service',
            metadata: {
              name: 'jilo'
            }
          }
        ]
      )
    ]
    const previousDeployment = new DeploymentEntityV2(
      reconcileFixtures.previousDeploymentId,
      'some-author',
      'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      cdConfig,
      'some-url',
      previousComponents,
      false
    )

    const currentComponents = [
      {
        kind: 'Deployment',
        metadata: {
          name: 'abobora-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'abobora',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Deployment',
        metadata: {
          name: 'jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'jilo',
          namespace: 'my-namespace'
        }
      }
    ]
    const concat = reconcile.concatWithPrevious(previousDeployment, currentComponents, cdConfig)
    const expected = [
      {
        kind: 'Deployment',
        metadata: {
          name: 'abobora-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'abobora',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Deployment',
        metadata: {
          name: 'jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'jilo',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Deployment',
        metadata: {
          name: 'batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          namespace: 'my-namespace'
        }
      },
      {
        kind: 'Service',
        metadata: {
          name: 'batata',
          namespace: 'my-namespace'
        }
      }
    ]
    expect(concat).toEqual(expected)
  })
})
