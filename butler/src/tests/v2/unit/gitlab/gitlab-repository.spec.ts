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

import * as fs from 'fs'
import * as path from 'path'

import 'jest'
import { HttpService } from '@nestjs/common'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'

import { GitLabRepository } from '../../../../app/v2/core/integrations/gitlab/gitlab-repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console/console-logger.service'
import { ConfigurationConstants } from '../../../../app/v2/core/constants/application/configuration.constants'

describe('Download resources from gitlab', () => {
  const contents = getStubContents()
  const httpService = new HttpService()
  jest.spyOn(httpService, 'get')
    .mockImplementation(resourceName => of({
      data: contents[resourceName] || []
    } as AxiosResponse))

  const url = 'https://gitlab.com/api/v4/projects/22700476/repository'

  it('Download helm chart recursively from gitlab', async() => {
    const repository = new GitLabRepository(new ConsoleLoggerService(), httpService)

    const resource = await repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart', branch: 'master' })

    expect(resource.name).toBe('helm-chart')
    expect(resource.type).toBe('directory')
    expect(resource.children).toHaveLength(3)

    const template = resource.children?.[2]
    expect(template?.children).toHaveLength(2)
  })

  it('Download a single file from giblab', async() => {
    const repository = new GitLabRepository(new ConsoleLoggerService(), httpService)

    const resource = await repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart/Chart.yaml', branch: 'master' })

    expect(resource.name).toBe('Chart.yaml')
    expect(resource.type).toBe('file')
    expect(resource.content).toBeTruthy()
  })

  it('Download helm chart recursively from gitlab from feature branch', async() => {
    const repository = new GitLabRepository(new ConsoleLoggerService(), httpService)

    const resource = await repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart', branch: 'feature' })

    expect(resource.name).toBe('helm-chart')
    expect(resource.type).toBe('directory')
    expect(resource.children).toHaveLength(3)

    const template = resource.children?.[2]
    expect(template?.children).toHaveLength(2)
  })

  it('Should invoke the gitlab api service with the correct configuration object', async() => {
    const gitlabToken = 'gitlab-auth-token123'
    const repository = new GitLabRepository(new ConsoleLoggerService(), httpService)
    const expectedRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': gitlabToken
      },
      timeout: ConfigurationConstants.CHART_DOWNLOAD_TIMEOUT
    }

    const getSpy = jest.spyOn(httpService, 'get')

    await repository.getResource({ url: url, token: gitlabToken, resourceName: 'helm-chart', branch: 'feature' })
    expect(getSpy).toHaveBeenCalledWith(expect.anything(), expectedRequestConfig)
  })
})

function getStubContents() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../../', 'stubs/helm-chart/gitlab-contents.json'), 'utf8'))
}
