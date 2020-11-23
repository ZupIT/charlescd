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

import { Manifest } from '../manifest'
import { ManifestConfig } from '../manifest.interface'
import { Repository } from '../../../core/integrations/interfaces/repository.interface'
import { Resource, ResourceType } from '../../integrations/interfaces/repository-response.interface'

@Injectable()
export class HelmManifest implements Manifest {

  private static readonly TMP_DIR = os.tmpdir()

  constructor(private repository: Repository) {}

  public async generate(config: ManifestConfig): Promise<string> {
    const resource = await this.repository.getResource(config.componentName)
    const chartPath = this.getTmpChartDir()
    try {
      await this.saveFiles(chartPath, resource)
      return await this.package(chartPath, config)
    } finally {
      this.cleanUp(chartPath)
    }
  }

  private getTmpChartDir(): string {
    return os.tmpdir() + path.sep + uuid.v4()
  }

  private async saveFiles(chartPath: string, resource: Resource): Promise<void> {
    let basePath = chartPath + path.sep + resource.name
    await fs.mkdir(basePath, { recursive: true })
    if(resource.children) {
      for (let i = 0; i < resource.children.length; i++) {
        let child = resource.children[i]
        if(child.type == ResourceType.DIR) {
          await this.saveFiles(basePath, child)
        } else {
          await fs.writeFile(basePath + path.sep + child.name, child.content, { encoding: 'base64' })
        }
      }
    }
  }

  private cleanUp(file: string) {
    rimraf(file, () => {})
  }

  private async package(chartPath: string, config: ManifestConfig): Promise<string> {
    const args = this.formatArguments(chartPath, config)
    return this.executeCommand(args)
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
    const overrideValues = this.toStringArray(this.extractCustomValues(config))
    const command = ['template', config.componentName, `${chartPath}${path.sep}${config.componentName}`, '-f', `${chartPath}${path.sep}${config.componentName}${path.sep}${config.componentName}.yaml`]
    if(config.namespace) {
      command.push('--namespace')
      command.push(config.namespace)
    }
    if(overrideValues) {
      command.push('--set')
      command.push(overrideValues)
    }
    return command
  }

  private extractCustomValues(config: ManifestConfig): any {
    return {
      name: config.componentName,
      'image.tag': config.imageUrl,
      circleId: config.circleId
    }
  }

  private toStringArray(customValues: any): string {
    return Object.getOwnPropertyNames(customValues).reduce((acc, cur) => {
      if(customValues[cur]) {
        return acc + `${cur}=${customValues[cur]},`
      }
      return acc
    }, "")
  }
}