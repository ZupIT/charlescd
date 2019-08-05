/* eslint-disable new-cap */
import cloneDeep from 'lodash/cloneDeep'
import { baseSpinnaker, webhookBaseStage } from '../utils/constants'
import createSpinnakerStage from './createSpinnakerStage'
import GetMustacheResult from './getMustacheResult'
import GetReposFiles from './getReposFiles'

export default async (auth, owner, repo, path, view) => {
  const allCompiledFiles = await GetMustacheResult(auth, owner, repo, path, view)
  const deployOrderFile = await GetReposFiles(auth, owner, repo, `${path}/spinnaker/order.json`)
  const deployOrder = JSON.parse(new Buffer.from(deployOrderFile.content, 'base64').toString())
  const pipelineName = view.pipelineName ? view.pipelineName : 'Name default'
  const applicationName = view.applicationName ? view.applicationName : 'Name default'
  const appName = view.appName ? view.appName : 'Name default'
  const cloneBase = cloneDeep(baseSpinnaker(pipelineName, applicationName, appName))
  deployOrder.map((orderId) => {
    if (orderId.length) {
      console.log('passou aqui no length')
      return orderId.map((orderIdUnic, index) => {
        return allCompiledFiles.map((object, index) => {
          if (object.length) {
            if (orderIdUnic.kind === object[index].kind) {
              const formatedStage = createSpinnakerStage(object[index], orderIdUnic, view)

              return cloneBase.stages.push(formatedStage)
            }
          }
          if (object.kind === 'Deployment') {
            if (orderIdUnic.kind === object.kind) {
              const formatedStage = createSpinnakerStage(object, orderIdUnic, view)
              return cloneBase.stages.push(formatedStage)
            }
          }
        })
      })
    }

    return allCompiledFiles.map((object) => {
      if (orderId.kind === object.kind) {
        const formatedStage = createSpinnakerStage(object, orderId, view)
        cloneBase.stages.push(formatedStage)
      }
    })
  })
  console.log(cloneBase)
  if (view.webhookUri) {
    cloneBase.stages.push(webhookBaseStage(view.webhookUri))
  }
  return cloneBase
}
