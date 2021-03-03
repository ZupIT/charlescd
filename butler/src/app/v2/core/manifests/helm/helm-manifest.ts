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

import { Injectable } from '@nestjs/common'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import * as os from 'os'
import * as path from 'path'
import * as rimraf from 'rimraf'
import * as uuid from 'uuid'
import { RequestConfig, Resource, ResourceType } from '../../../core/integrations/interfaces/repository.interface'
import { KubernetesManifest } from '../../integrations/interfaces/k8s-manifest.interface'
import { RepositoryStrategyFactory } from '../../integrations/repository-strategy-factory'
import { ConsoleLoggerService } from '../../logs/console/console-logger.service'
import { Manifest } from '../manifest'
import { ManifestConfig } from '../manifest.interface'

@Injectable()
export class HelmManifest implements Manifest {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly repositoryFactory: RepositoryStrategyFactory) {}

  public async generate(config: ManifestConfig): Promise<KubernetesManifest[]> {
    this.consoleLoggerService.log('START:GENERATING MANIFEST USING HELM')
    const requestConfig : RequestConfig = {
      url: config.repo.url,
      token: config.repo.token,
      resourceName: config.componentName,
      branch: config.repo.branch
    }
    this.consoleLoggerService.log('GET:CHART FROM REPOSITORY', config.componentName)
    const repository = this.repositoryFactory.create(config.repo.provider)
    const chart = await repository.getResource(requestConfig)
    const chartPath = this.getTmpChartDir()
    try {
      this.consoleLoggerService.log('START:SAVING CHART LOCALLY', chartPath)
      await this.saveChartFiles(chartPath, chart)
      this.consoleLoggerService.log('START:GENERATE MANIFEST')
      const manifest =  await this.template(chartPath, config.componentName, config.namespace, config.imageUrl, config.circleId)
      this.consoleLoggerService.log('FINISH:MANIFEST GENERATED')
      return manifest
    } finally {
      this.consoleLoggerService.log('START:CLEANING TEMP FILES', chartPath)
      this.cleanUp(chartPath)
    }
  }

  private getTmpChartDir(): string {
    return os.tmpdir() + path.sep + uuid.v4()
  }

  private async saveChartFiles(chartPath: string, chart: Resource): Promise<void> {
    const basePath = chartPath + path.sep + chart.name
    await fs.mkdir(basePath, { recursive: true })
    if(chart.children) {
      for (const child of chart.children) {
        if(child.type == ResourceType.DIR) {
          await this.saveChartFiles(basePath, child)
        } else {
          await fs.writeFile(basePath + path.sep + child.name, child.content, { encoding: 'base64' })
        }
      }
    }
  }

  private cleanUp(dir: string) {
    rimraf(dir, (error) => this.consoleLoggerService.error('ERROR:CLEANING FILES UP FAILED', error))
  }

  private async template(chartPath: string, componentName: string, namespace: string, imageUrl: string, circleId: string): Promise<KubernetesManifest[]> {
    const args = this.formatArguments(chartPath, componentName, namespace, imageUrl, circleId)
    this.consoleLoggerService.log('HELM COMMAND ARGS', args)
    const manifestString = await this.executeCommand(args)
    this.consoleLoggerService.log('MANIFEST GENERATED', manifestString)
    return yaml.safeLoadAll(manifestString)
  }

  private async executeCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let result = '', err = ''

      const helmProcess = spawn('helm', args)
      helmProcess.stdout.on('data', data => result += data)
      helmProcess.stderr.on('data', data => err += data)

      helmProcess.on('close', (code) => {
        if (err) {
          reject({
            err: err,
            code: code
          })
          return
        }
        resolve(result)
      })
    })
  }

  private formatArguments(chartPath: string, componentName: string, namespace: string, imageUrl: string, circleId: string) {
    const chart = `${chartPath}${path.sep}${componentName}`
    const valuesFile = this.getValuesFile(chartPath, componentName)
    const command = ['template', componentName, chart, '-f', valuesFile]
    if(namespace) {
      command.push('--namespace')
      command.push(namespace)
    }

    const overrideValues = this.toStringArray(this.extractCustomValues(componentName, imageUrl, circleId))
    if(overrideValues) {
      command.push('--set')
      command.push(overrideValues)
    }
    return command
  }

  private getValuesFile(chartPath: string, componentName: string): string {
    return `${chartPath}${path.sep}${componentName}${path.sep}${componentName}.yaml`
  }

  private extractCustomValues(componentName: string, imageUrl: string, circleId: string): Record<string, string | undefined> {
    return {
      name: componentName,
      'image.tag': imageUrl,
      circleId: circleId
    }
  }

  private toStringArray(customValues: Record<string, unknown>): string {
    return Object.getOwnPropertyNames(customValues).reduce((acc, cur) => {
      if(customValues[cur]) {
        return acc + `${cur}=${customValues[cur]},`
      }
      return acc
    }, '')
  }
}
