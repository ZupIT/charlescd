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

import { HttpService, Injectable } from '@nestjs/common'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ConfigurationConstants } from '../../constants/application/configuration.constants'
import { ConsoleLoggerService } from '../../logs/console/console-logger.service'

import { Repository, RequestConfig, Resource, ResourceType } from '../interfaces/repository.interface'

@Injectable()
export class GitLabRepository implements Repository {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly httpService: HttpService) {}

  public async getResource(requestConfig: RequestConfig): Promise<Resource> {
    const resourcePath = `/tree?path=${requestConfig.resourceName}`
    this.consoleLoggerService.log('START:DOWNLOADING CHART FROM GITLAB', `${requestConfig.url}${resourcePath}&ref=${requestConfig.branch}`)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': requestConfig.token
      },
      timeout: ConfigurationConstants.CHART_DOWNLOAD_TIMEOUT
    }
    return this.downloadResource(requestConfig.url, resourcePath, requestConfig.resourceName, config, requestConfig.branch)
  }

  private async downloadResource(baseUrl: string, resourcePath: string, resourceName: string, config: AxiosRequestConfig, branch: string): Promise<Resource> {
    const urlResource = `${baseUrl}${resourcePath}&ref=${branch}`
    const response = await this.fetch(urlResource, config)

    if(this.isResourceFile(response.data)) {
      return this.downloadFile(baseUrl, resourceName, config, branch)
    }

    const resource: Resource = {
      name: resourceName,
      type: ResourceType.DIR,
      children: []
    }

    for (const item of response.data) {
      if (item.type === 'tree') {
        const nextResourcePath = `${resourcePath}/${item.name}`
        resource.children?.push(await this.downloadResource(baseUrl, nextResourcePath, item.name, config, branch))
      } else {
        resource.children?.push(await this.downloadFile(baseUrl, item.path, config, branch))
      }
    }
    return resource
  }

  private async downloadFile(baseUrl: string, path: string, config: AxiosRequestConfig, branch: string): Promise<Resource> {
    const fileUrl = `${baseUrl}/files/${encodeURIComponent(path)}?ref=${branch}`
    const fileContent = await this.fetch(fileUrl, config)
    return {
      name: fileContent.data.file_name,
      type: ResourceType.FILE,
      content: fileContent.data.content
    }
  }

  private isResourceFile(data?: unknown[]): boolean {
    return !data?.length
  }

  private async fetch(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    this.consoleLoggerService.log('START:FETCHING RESOURCE', url)
    return this.httpService.get(url, config).toPromise()
  }
}
