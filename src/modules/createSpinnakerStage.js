import cloneObj from 'lodash/cloneDeep'
import { baseManifest } from '../utils/constants'

export default (deployment, refId, view) => {
  const newObj = cloneObj(baseManifest)
  newObj.manifests.push(deployment)
  newObj.name = `Deploy ${deployment.kind}`
  newObj.refId = String(refId.id)
  newObj.requisiteStageRefIds = refId.requireId
  newObj.account = view.account ? view.account : 'default'
  newObj.moniker = {
    app: view.applicationName ? view.applicationName : 'default',
  }

  return newObj
}

