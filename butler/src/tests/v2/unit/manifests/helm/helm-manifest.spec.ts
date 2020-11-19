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
import { Repository } from '../../../../../app/v2/core/integrations/interfaces/repository.interface'
import { ManifestConfig } from '../../../../../app/v2/core/manifests/manifest.interface'

describe('Generate K8s manifest by helm', () => {
  const manifestConfig = {
    repo: {
      url: 'https://myrepo.com/test',
      token: 'my-token'
    },
    namespace: 'default',
    componentName: "test",
    imageUrl: "latest",
    circleId: "f5d23a57-5607-4306-9993-477e1598cc2a"
  }

  const mockRepository = {
    getTemplateAndValueFor: jest.fn()
  }

  it('should generate manifest with custom values', async() => {
    const basePath = path.join(__dirname, '../../../../../', 'resources/helm-test-chart')

    mockRepository.getTemplateAndValueFor.mockImplementation(name => {
      const template = fs.readFileSync(`${basePath}/${name}-darwin.tgz`, { encoding: 'base64' })
      const values = fs.readFileSync(`${basePath}/${name}.yaml`, { encoding: 'base64' })

      return [template, values]
    })

    const helm = new HelmManifest(mockRepository)
    const manifest = await helm.generate(manifestConfig)

    const expected = fs.readFileSync(`${basePath}/manifest.yaml`, 'utf-8')

    expect(manifest).toEqual(expected)
  })
})
