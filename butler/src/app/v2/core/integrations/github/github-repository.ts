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

import { Resource, ResourceType } from '../interfaces/repository-response.interface'
import { Repository } from '../interfaces/repository.interface'

@Injectable()
export class GitHubRepository implements Repository {

  constructor(private readonly httpService: HttpService,
    private readonly url: string, 
    private readonly token: string) {}

  public async getResource(dirname: string): Promise<Resource> {
    const urlResource = `${this.url}/${dirname}`
    return await this.downloadResource(urlResource, dirname, {
      'Content-Type': 'application/json',
      'Authorization': this.token
    })
  }

  private async downloadResource(url: string, dirname: string, headers: any): Promise<Resource> {
    const response = await this.fetch(url, headers)
    
    if(!Array.isArray(response.data)) {
      return {
        name: dirname,
        type: ResourceType.FILE,
        content: response.data.content
      } as Resource
    }
    
    const resource: Resource = {
      name: dirname,
      type: ResourceType.DIR,
      children: []
    }

    for (const item of response.data) {
      if (item.type == 'dir') {
        const urlResource = `${url}/${item.name}`
        resource.children?.push(await this.downloadResource(urlResource, item.name, headers))
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

  private async fetch(url: string, headers: any): Promise<AxiosResponse> {
    return this.httpService.get(url, headers).toPromise()
  }
}