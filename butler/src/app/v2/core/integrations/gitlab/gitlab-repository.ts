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

@Injectable()
export class GitLabRepository implements Repository {

  constructor(private readonly httpService: HttpService) {}

  public async getResource(config: RequestConfig): Promise<Resource> {
    const resourcePath = `/tree?path=${config.resourceName}`
    const headers = {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': config.token
    }
    return this.downloadResource(config.url, resourcePath, config.resourceName, headers, config.branch)
  }

  private async downloadResource(baseUrl: string, resourcePath: string, resourceName: string, headers: Record<string, string>, branch: string): Promise<Resource> {
    const urlResource = `${baseUrl}${resourcePath}&ref=${branch}`
    const response = await this.fetch(urlResource, headers)
    
    if(this.isResourceFile(response.data)) {
      return this.downloadFile(baseUrl, resourceName, headers, branch)
    }
    
    const resource: Resource = {
      name: resourceName,
      type: ResourceType.DIR,
      children: []
    }

    for (const item of response.data) {
      if (item.type === 'tree') {
        const nextResourcePath = `${resourcePath}/${item.name}`
        resource.children?.push(await this.downloadResource(baseUrl, nextResourcePath, item.name, headers, branch))
      } else {
        resource.children?.push(await this.downloadFile(baseUrl, item.path, headers, branch))
      }
    }
    return resource
  }

  private async downloadFile(baseUrl: string, path: string, headers: Record<string, string>, branch: string): Promise<Resource> {
    const fileUrl = `${baseUrl}/files/${encodeURIComponent(path)}?ref=${branch}`
    const fileContent = await this.fetch(fileUrl, headers)
    return {
      name: fileContent.data.file_name,
      type: ResourceType.FILE,
      content: fileContent.data.content
    }
  }

  private isResourceFile(data?: unknown[]): boolean {
    return !data?.length
  }

  private async fetch(url: string, headers: Record<string, string>): Promise<AxiosResponse> {
    return this.httpService.get(url, headers).toPromise()
  }
}