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

import { Manifest } from '../manifest'
import { ManifestConfig } from '../manifest.interface'
import { Repository } from '../../../core/integrations/interfaces/repository.interface'

export class Helm implements Manifest {

  private static readonly TMP_DIR = '/home/leandro'

  constructor(private repository: Repository) {}

  public async generate(config: ManifestConfig): Promise<string> {
    const customValues = this.toStringArray(this.extractCustomValues(config))
    const [template, values] = await this.repository.getTemplateAndValueFor(config.componentName)
    const tmpFiles: string[] = []
    try {
      tmpFiles.push(await this.saveTmpFile(template))
      tmpFiles.push(await this.saveTmpFile(values))
      return await this.package(tmpFiles[0], tmpFiles[1], customValues)
    } finally {
      tmpFiles.forEach(file => this.cleanUp(file))
    }
  }

  private cleanUp(file: string) {
    fs.unlink(file)
  }

  private async package(templateFile: string, valuesFile: string, customValues: any): Promise<string> {
    const args = this.formatArguments(templateFile, valuesFile, customValues)
    return this.executeCommand(args)
  }

  private async executeCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let result = '', err = ''

      const helmProcess = spawn('helm', args)
      helmProcess.stdout.on('data', data => result += data);
      helmProcess.stderr.on('data', data => err += data);

      helmProcess.on('close', (code) => {
        if (err) {
          reject({
            err: err,
            code: code
          })
          return
        }
        resolve(result);
      });
    })
  }

  private formatArguments(templateFile: string, valuesFile: string, customValues: any) {
    return ['template', templateFile, '-f', valuesFile, '--set', customValues]
  }

  private async saveTmpFile(base64File: string): Promise<string> {
    const fileName = `${Helm.TMP_DIR}/${uuid.v4()}`
    await fs.writeFile(fileName, base64File, { encoding: 'base64' })
    return fileName
  }

  private extractCustomValues(config: ManifestConfig): any {
    return {
      name: config.componentName,
      namespace: config.namespace,
      'image.tag': config.imageUrl,
      circleId: config.circleId
    }
  }

  private toStringArray(customValues: any): string {
    return Object.getOwnPropertyNames(customValues).reduce((acc, cur) => acc + `${cur}=${customValues[cur]},`, "")
  }
}