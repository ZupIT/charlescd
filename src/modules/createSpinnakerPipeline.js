import cloneDeep from 'lodash/cloneDeep'
import { baseSpinnaker } from '../utils/constants'
import createSpinnakerStage from './createSpinnakerStage'
import GetMustacheResult from './getMustacheResult';
import GetReposFiles from './getReposFiles';

export default async (auth, owner, repo, path, view) => {
  const allCompiledFiles = await GetMustacheResult(auth, owner, repo, path, view)
  const deployOrderFile = await GetReposFiles(auth, owner, repo, `${path}/spinnaker/order.json`)
  const deployOrder = JSON.parse(new Buffer.from(deployOrderFile.content, 'base64').toString())
  const pipelineName = view.pipelineName ? view.pipelineName : 'Name default'
  const applicationName = view.applicationName ? view.applicationName : 'Name default'
  const cloneBase = cloneDeep(baseSpinnaker(pipelineName, applicationName))
  deployOrder.map((orderId) => {
    if (orderId.length) {
      return orderId.map((orderIdUnic) => {
        return allCompiledFiles.map((object) => {
          if (object.length) {
            return object.map((deployment) => {
              if (orderIdUnic.kind === deployment.kind
                && orderIdUnic.labels === deployment.metadata.labels.version) {
                const formatedStage = createSpinnakerStage(deployment, orderIdUnic)

                return cloneBase.stages.push(formatedStage)
              }
            })
          }
        })
      })
    }

    return allCompiledFiles.map((object) => {
      if (orderId.kind === object.kind) {
        const formatedStage = createSpinnakerStage(object, orderId)
        cloneBase.stages.push(formatedStage)
      }
    })
  })
  return cloneBase
}


