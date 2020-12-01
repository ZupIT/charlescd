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
import { AxiosResponse } from 'axios'

import { Repository, RequestConfig, Resource, ResourceType } from '../interfaces/repository.interface'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'

@Injectable()
export class GitHubRepository implements Repository {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly httpService: HttpService) {}

  public async getResource(config: RequestConfig): Promise<Resource> {
    const urlResource = new URL(`${config.url}/contents/${config.resourceName}?ref=${config.branch}`)
    this.consoleLoggerService.log('START:DOWNLOADING CHART FROM GITHUB', urlResource)
    return this.downloadResource(urlResource, config.resourceName, {
      'Content-Type': 'application/json',
      'Authorization': config.token
    })
  }

  private async downloadResource(url: URL, resourceName: string, headers: Record<string, string>): Promise<Resource> {
    const response = await this.fetch(url, headers)
    
    if(this.isFile(response.data)) {
      return {
        name: response.data.name,
        type: ResourceType.FILE,
        content: response.data.content
      } as Resource
    }
    
    const resource: Resource = {
      name: resourceName,
      type: ResourceType.DIR,
      children: []
    }

    for (const item of response.data) {
      if (item.type === 'dir') {
        url.pathname = `${url.pathname}/${item.name}`
        resource.children?.push(await this.downloadResource(url, item.name, headers))
      } else {
        const fileContent = await this.fetch(item._links.git, headers)
        resource.children?.push({
          name: item.name,
          type: ResourceType.FILE,
          content: fileContent.data.content
        })
      }
    }
    return resource
  }

  private isFile(data: unknown): boolean {
    return !Array.isArray(data)
  }

  private async fetch(url: URL, headers: Record<string, string>): Promise<AxiosResponse> {
    this.consoleLoggerService.log('START:FETCHING RESOURCE', url.toString())
    return this.httpService.get(url.toString(), headers).toPromise()
  }
}