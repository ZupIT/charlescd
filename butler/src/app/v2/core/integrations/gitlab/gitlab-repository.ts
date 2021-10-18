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

import { HttpService, Inject, Injectable } from '@nestjs/common'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ConfigurationConstants } from '../../constants/application/configuration.constants'
import { ConsoleLoggerService } from '../../logs/console'

import { Repository, RequestConfig, Resource, ResourceType } from '../interfaces/repository.interface'
import { ExceptionBuilder } from '../../utils/exception.utils'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { Observable, of, throwError } from 'rxjs'
import { AppConstants } from '../../constants'
import * as https from 'https'
import { IoCTokensConstants } from '../../constants/ioc'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'

@Injectable()
export class GitLabRepository implements Repository {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly httpService: HttpService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {}

  public async getResource(requestConfig: RequestConfig): Promise<Resource> {
    const urlResource = new URL(requestConfig.url)
    this.appendPathParam(urlResource, requestConfig.resourceName)

    this.consoleLoggerService.log('START:DOWNLOADING CHART FROM GITLAB', { urlResource })

    // TODO stop accepting self-signed TLS certificates
    const agent = new https.Agent({ rejectUnauthorized: this.envConfiguration.rejectUnauthorizedTLS })
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': requestConfig.token
      },
      timeout: ConfigurationConstants.CHART_DOWNLOAD_TIMEOUT,
      httpsAgent: agent
    }
    return this.downloadResource(urlResource, requestConfig.resourceName, config)
  }

  private async downloadResource(url: URL, resourceName: string, config: AxiosRequestConfig): Promise<Resource> {
    const response = await this.fetch(`${url.origin}${url.pathname}/tree${url.search}`, config)
    if (!response || !response.data){
      throw new ExceptionBuilder('Error downloading resource', HttpStatus.INTERNAL_SERVER_ERROR).build()
    }
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
    if (!fileContent) {
      throw new ExceptionBuilder('Error downloading file', HttpStatus.INTERNAL_SERVER_ERROR).build()
    }
    return {
      name: fileContent.data.file_name,
      type: ResourceType.FILE,
      content: fileContent.data.content
    }
  }

  private isResourceFile(data?: unknown[]): boolean {
    return !data?.length
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private async fetch(url: string, config: AxiosRequestConfig):Promise<AxiosResponse<any> | undefined> {
    this.consoleLoggerService.log('START:FETCHING RESOURCE', url)
    try {
      return await this.httpService.get(url, config).pipe(
        map(response => response),
        retryWhen(error => this.getRetryFetchCondition(error) )
      ).toPromise()
    }catch(error ) {
      this.consoleLoggerService.error('ERROR:FETCHING_RESOURCE', error)
      const status = error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR
      const statusMessage = error.response ? error.response.statusText : 'INTERNAL_SERVER_ERROR'
      throw new ExceptionBuilder(`Unable to fetch resource from gitlab url: ${url}`, status)
        .withDetail(`Status '${statusMessage}' with error: ${error}`)
        .withSource('components.helmRepository')
        .build()
    }

  }

  private appendPathParam(urlResource: URL, resourceName: string): void {
    const pathValue = urlResource.searchParams.get('path')
    urlResource.searchParams.set(
      'path',
      pathValue ? `${pathValue}/${resourceName}` : resourceName
    )
  }

  private getRetryFetchCondition(fetchError: Observable<unknown>) {
    return fetchError.pipe(
      concatMap((error, attempts: number) => {
        return attempts >= AppConstants.MOOVE_NOTIFICATION_MAXIMUM_RETRY_ATTEMPTS   ?
          throwError(error) :
          of(error).pipe(
            tap(() => this.consoleLoggerService.log(`Fetch attempt #${attempts + 1}. Retrying fetch resource!`)),
            delay(AppConstants.MOOVE_NOTIFICATION_MILLISECONDS_RETRY_DELAY)
          )
      },
      )
    )
  }
}
