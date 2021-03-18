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
import { ConsoleLoggerService } from '../../logs/console'

import { Repository, RequestConfig, Resource, ResourceType } from '../interfaces/repository.interface'

@Injectable()
export class GitLabRepository implements Repository {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly httpService: HttpService) {}

  public async getResource(requestConfig: RequestConfig): Promise<Resource> {
    const urlResource = new URL(requestConfig.url)
    this.appendPathParam(urlResource, requestConfig.resourceName)

    this.consoleLoggerService.log('START:DOWNLOADING CHART FROM GITLAB', { urlResource })
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': requestConfig.token
      },
      timeout: ConfigurationConstants.CHART_DOWNLOAD_TIMEOUT
    }
    return this.downloadResource(urlResource, requestConfig.resourceName, config)
  }

  private async downloadResource(url: URL, resourceName: string, config: AxiosRequestConfig): Promise<Resource> {
    const response = await this.fetch(`${url.origin}${url.pathname}/tree${url.search}`, config)

    if(this.isResourceFile(response.data)) {
      return this.downloadFile(url, resourceName, config)
    }

    const resource: Resource = {
      name: resourceName,
      type: ResourceType.DIR,
      children: []
    }

    for (const item of response.data) {
      if (item.type === 'tree') {
        const newUrl = new URL(url.toString())
        this.appendPathParam(newUrl, item.name)
        resource.children?.push(await this.downloadResource(newUrl, item.name, config))
      } else {
        resource.children?.push(await this.downloadFile(url, item.path, config))
      }
    }
    return resource
  }

  private async downloadFile(url: URL, path: string, config: AxiosRequestConfig): Promise<Resource> {
    const fileUrl = `${url.origin}${url.pathname}/files/${encodeURIComponent(path)}?ref=${url.searchParams.get('ref')}`
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

  private appendPathParam(urlResource: URL, resourceName: string): void {
    const pathValue = urlResource.searchParams.get('path')
    urlResource.searchParams.set(
      'path',
      pathValue ? `${pathValue}/${resourceName}` : resourceName
    )
  }
}
