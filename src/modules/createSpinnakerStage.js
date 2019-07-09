import cloneObj from 'lodash/cloneDeep'
import { baseManifest } from '../utils/constants'

export default (deployment, refId) => {
  const newObj = cloneObj(baseManifest)
  newObj.manifests.push(deployment)
  newObj.name = `Deploy ${deployment.kind}`
  newObj.refId = String(refId.id)
  newObj.requisiteStageRefIds = refId.requireId
  newObj.moniker = {
    app: 'testepipelinemustache',
  }

  return newObj
}

