/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { HttpService, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigurationConstants } from '../../constants/application/configuration.constants'
import { ConsoleLoggerService } from '../../logs/console'
import { Repository, RequestConfig, Resource, ResourceType } from '../interfaces/repository.interface'
import { ExceptionBuilder } from '../../utils/exception.utils'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { Observable, of, throwError } from 'rxjs'
import { AppConstants } from '../../constants'
import * as https from 'https'
import { IoCTokensConstants } from '../../constants/ioc'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { URL } from 'url'

@Injectable()
export class GitHubRepository implements Repository {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly httpService: HttpService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {}

  public async getResource(requestConfig: RequestConfig): Promise<Resource> {
    const urlResource = new URL(requestConfig.url)
    urlResource.pathname = `${urlResource.pathname}/${requestConfig.resourceName}`

    // TODO stop accepting self-signed TLS certificates
    const agent = new https.Agent({ rejectUnauthorized: this.envConfiguration.rejectUnauthorizedTLS })
    this.consoleLoggerService.log('START:DOWNLOADING CHART FROM GITHUB', urlResource)
    return this.downloadResource(urlResource, requestConfig.resourceName, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${requestConfig.token}`
      },
      timeout: ConfigurationConstants.CHART_DOWNLOAD_TIMEOUT,
      httpsAgent: agent
    })
  }

  private async downloadResource(url: URL, resourceName: string, config: AxiosRequestConfig): Promise<Resource> {
    const response = await this.fetch(url, config)
    if (!response || !response.data){
      throw new ExceptionBuilder('Error downloading chart', HttpStatus.INTERNAL_SERVER_ERROR).build()
    }
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
        resource.children?.push(await this.downloadResource(url, item.name, config))
      } else {
        const fileContent = await this.fetch(item._links.git, config)
        if (!fileContent || !fileContent.data){
          throw new ExceptionBuilder('Error reading file content', HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private async fetch(url: URL, config: AxiosRequestConfig): Promise<AxiosResponse<any> | undefined>{
    this.consoleLoggerService.log('START:FETCHING_RESOURCE', url.toString())
    try {
      return await this.httpService.get(url.toString(), config).pipe(
        map(response => response),
        retryWhen(error => this.getRetryFetchCondition(error) )
      ).toPromise()
    } catch (error) {
      this.consoleLoggerService.error('ERROR:FETCHING_RESOURCE', error)
      const status = error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR
      const statusMessage = error.response ? error.response.statusText : 'INTERNAL_SERVER_ERROR'
      throw new ExceptionBuilder(`Unable to fetch resource from github url: ${url}`, status)
        .withDetail(`Status '${statusMessage}' with error: ${error}`)
        .withSource('components.helmRepository')
        .build()
    }
  }

  private getRetryFetchCondition(fetchError: Observable<unknown>) {
    return fetchError.pipe(
      concatMap((error, attempts: number) => {
        return attempts >= AppConstants.FETCH_RESOURCE_MAXIMUM_RETRY_ATTEMPTS   ?
          throwError(error) :
          of(error).pipe(
            tap(() => this.consoleLoggerService.log(`Fetch attempt #${attempts + 1}. Retrying fetch resource!`)),
            delay(AppConstants.FETCH_RESOURCE_MILLISECONDS_RETRY_DELAY)
          )
      },
      )
    )
  }
}

