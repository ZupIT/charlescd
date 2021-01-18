import 'jest'
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
})
