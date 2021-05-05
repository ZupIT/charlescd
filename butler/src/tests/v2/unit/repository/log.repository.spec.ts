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

import 'jest'

import { LogEntity } from '../../../../app/v2/api/deployments/entity/logs.entity'
import { LogRepository } from '../../../../app/v2/api/deployments/repository/log.repository'

describe('Log Repository', () => {

  let logRepository: LogRepository

  beforeEach(() => {
    logRepository = new LogRepository()
  })

  it('should return the log list ordered by timestamp ASC', async() => {
    const unsortLogs = [
      {
        deploymentId: 'aa01ff6c-a7ca-4c6e-af81-abde33b375ea',
        logs: [
          {
            type: 'INFO',
            title: 'Pulled',
            details: '{"message":"Container image "mongo:4.2" already present on machine","object":"Pod/mongo-55bf56c9df-4n7pt"}',
            timestamp: '2021-04-29T17:49:48-03:00'
          },
          {
            type: 'INFO',
            title: 'Killing',
            details: '{"message":"Stopping container guestbook","object":"Pod/frontend-7cb5fb8b96-jpj6v"}',
            timestamp: '2021-04-29T17:49:46-03:00'
          }
        ]
      } as LogEntity
    ]

    jest.spyOn(logRepository, 'query')
      .mockImplementation(() => Promise.resolve(unsortLogs))

    const sortedLogs = await logRepository.findDeploymentLogs('aa01ff6c-a7ca-4c6e-af81-abde33b375ea')

    const expected = {
      deploymentId: 'aa01ff6c-a7ca-4c6e-af81-abde33b375ea',
      logs: [
        {
          type: 'INFO',
          title: 'Killing',
          details: '{"message":"Stopping container guestbook","object":"Pod/frontend-7cb5fb8b96-jpj6v"}',
          timestamp: '2021-04-29T17:49:46-03:00'
        },
        {
          type: 'INFO',
          title: 'Pulled',
          details: '{"message":"Container image "mongo:4.2" already present on machine","object":"Pod/mongo-55bf56c9df-4n7pt"}',
          timestamp: '2021-04-29T17:49:48-03:00'
        }
      ]
    }

    expect(sortedLogs).toEqual(expected)
  })
})