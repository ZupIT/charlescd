import { HttpService, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'

import { Resource, ResourceType } from '../interfaces/repository-response.interface';
import { Repository } from '../interfaces/repository.interface';

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
    const resources: Resource = {
      name: dirname,
      type: ResourceType.DIR,
      children: []
    }

    const response = await this.fetch(url, headers)

    for (const resource of response.data) {
      if (resource.type == 'dir') {
        const urlResource = `${url}/${resource.name}`
        resources.children?.push(await this.downloadResource(urlResource, resource.name, headers))
      } else {
        const fileContent = await this.fetch(resource._links.git, headers)
        resources.children?.push({
          name: resource.name,
          type: ResourceType.FILE,
          content: fileContent.data.content
        })
      }
    }
    return resources
  }

  private async fetch(url: string, headers: any): Promise<AxiosResponse> {
    return this.httpService.get(url, headers).toPromise()
  }
}