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

import * as fs from 'fs'
import * as path from 'path'

import 'jest'

import { HelmManifest } from '../../../../../app/v2/core/manifests/helm/helm-manifest'
import { GitProvidersEnum } from '../../../../../app/v1/core/integrations/configuration/interfaces'
import { Repository } from '../../../../../app/v2/core/integrations/interfaces/repository.interface'
import { ManifestConfig } from '../../../../../app/v2/core/manifests/manifest.interface'
import { Resource, ResourceType } from '../../../../..//app/v2/core/integrations/interfaces/repository-response.interface'

describe('Generate K8s manifest by helm', () => {
  const basePath = path.join(__dirname, '../../../../../', 'resources/helm-test-chart')
  const manifestConfig = {
    repo: {
      provider: GitProvidersEnum.GITHUB,
      url: 'https://myrepo.com/test',
      token: 'my-token'
    },
    componentName: "test",
    imageUrl: "latest",
    namespace: 'my-namespace',
    circleId: "f5d23a57-5607-4306-9993-477e1598cc2a"
  }

  const mockRepository = {
    getTemplateAndValueFor: jest.fn(),

    getResource: jest.fn()
  }

  mockRepository.getTemplateAndValueFor.mockImplementation(name => {
    const template = fs.readFileSync(`${basePath}/${name}-darwin.tgz`, { encoding: 'base64' })
    const values = fs.readFileSync(`${basePath}/${name}.yaml`, { encoding: 'base64' })

    return [template, values]
  })

  mockRepository.getResource.mockImplementation(async name => await readFiles(basePath))

  async function readFiles(dir: string): Promise<Resource> {
    let resources: Resource = {
      name: dir,
      type: ResourceType.DIR,
      children: []
    }
    let files = fs.readdirSync(dir, { withFileTypes: true })
    for (let i = 0; i < files.length; i++) {
      let dirent = files[i]
      let filePath = path.join(dir, dirent.name)
      if (dirent.isDirectory()) {
        resources.children?.push(await readFiles(filePath))
      } else {
        resources.children?.push({
          name: dirent.name,
          type: ResourceType.FILE,
          content: fs.readFileSync(filePath, { encoding: 'base64' })
        })
      }
    }
    return resources
  }

  it('should generate manifest with default values', async () => {
    const manifestConfig = {
      repo: {
        provider: GitProvidersEnum.GITHUB,
        url: 'https://myrepo.com/test',
        token: 'my-token'
      },
      componentName: "test",
      imageUrl: "latest"
    }
    const helm = new HelmManifest(mockRepository)
    const manifest = await helm.generate(manifestConfig)

    const expected = fs.readFileSync(`${basePath}/manifest-default.yaml`, 'utf-8')

    expect(manifest).toEqual(expected)
  })

  it('should generate manifest with custom values', async () => {
    const helm = new HelmManifest(mockRepository)
    const manifest = await helm.generate(manifestConfig)

    const expected = fs.readFileSync(`${basePath}/manifest.yaml`, 'utf-8')

    expect(manifest).toEqual(expected)
  })

  it('should fail manifest generation when fails fetching files from repository', async () => {
    mockRepository.getTemplateAndValueFor.mockImplementation(() => { throw new Error('error') })

    const helm = new HelmManifest(mockRepository)
    const manifest = helm.generate(manifestConfig)

    expect(manifest).rejects.toThrowError()
  })
})
