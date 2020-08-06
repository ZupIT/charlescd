/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export interface IBaseWebhook {
  completeOtherBranchesThenFail: false
  continuePipeline: true
  customHeaders: {
    'x-circle-id': string | 'Default'
  }
  failPipeline: false
  method: 'POST'
  name: 'Trigger webhook'
  payload: {
    status: string,
    callbackType: string
  }
  refId: string
  requisiteStageRefIds: string[]
  statusUrlResolution: 'getMethod'
  type: 'webhook'
  url: string
}

const webhookBaseStage = (uriWebhook: string, refId: string, requisiteRefId: string[], previousStage: string, xCircleId: string, callbackType: string): IBaseWebhook => ({
  completeOtherBranchesThenFail: false,
  continuePipeline: true,
  customHeaders: {
    'x-circle-id': xCircleId || 'Default'
  },
  failPipeline: false,
  method: 'POST',
  name: 'Trigger webhook',
  payload: {
    status: '${#stage( \'' + previousStage + '\' ).status.toString()}',
    callbackType: callbackType
  },
  refId,
  requisiteStageRefIds: requisiteRefId,
  statusUrlResolution: 'getMethod',
  type: 'webhook',
  url: uriWebhook
})

export default webhookBaseStage
