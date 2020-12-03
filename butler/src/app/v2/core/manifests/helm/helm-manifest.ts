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

import { promises as fs } from 'fs'
import * as uuid from 'uuid'
import { spawn } from 'child_process'
import * as os from 'os'
import * as path from 'path'

import { Injectable } from '@nestjs/common'
import * as rimraf from 'rimraf'
import * as yaml from 'js-yaml'

import { Manifest } from '../manifest'
import { ManifestConfig } from '../manifest.interface'
import { Resource, ResourceType } from '../../../core/integrations/interfaces/repository.interface'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { KubernetesManifest } from '../../integrations/interfaces/k8s-manifest.interface'
import { RepositoryStrategyFactory } from '../../integrations/repository-strategy-factory'

@Injectable()
export class HelmManifest implements Manifest {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly repositoryFactory: RepositoryStrategyFactory) {}

  public async generate(config: ManifestConfig): Promise<KubernetesManifest[]> {
    this.consoleLoggerService.log('START:GENERATING MANIFEST USING HELM')
    const requestConfig = { 
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
      const manifest =  await this.template(chartPath, config)
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

  private async template(chartPath: string, config: ManifestConfig): Promise<KubernetesManifest[]> {
    const args = this.formatArguments(chartPath, config)
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

  private formatArguments(chartPath: string, config: ManifestConfig) {
    const chart = `${chartPath}${path.sep}${config.componentName}`
    const valuesFile = this.getValuesFile(chartPath, config)
    const command = ['template', config.componentName, chart, '-f', valuesFile]
    if(config.namespace) {
      command.push('--namespace')
      command.push(config.namespace)
    }
    
    const overrideValues = this.toStringArray(this.extractCustomValues(config))
    if(overrideValues) {
      command.push('--set')
      command.push(overrideValues)
    }
    return command
  }

  private getValuesFile(chartPath: string, config: ManifestConfig): string {
    return `${chartPath}${path.sep}${config.componentName}${path.sep}${config.componentName}.yaml`
  }

  private extractCustomValues(config: ManifestConfig): Record<string, string | undefined> {
    return {
      name: config.componentName,
      'image.tag': config.imageUrl,
      circleId: config.circleId
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