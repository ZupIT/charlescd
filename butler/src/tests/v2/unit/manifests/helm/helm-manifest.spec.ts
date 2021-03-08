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

import { HttpService } from '@nestjs/common'
import * as fs from 'fs'
import 'jest'
import * as yaml from 'js-yaml'
import * as path from 'path'
import { GitProvidersEnum } from '../../../../../app/v2/core/configuration/interfaces/git-providers.type'
import { GitHubRepository } from '../../../../../app/v2/core/integrations/github/github-repository'
import { GitLabRepository } from '../../../../../app/v2/core/integrations/gitlab/gitlab-repository'
import { KubernetesManifest } from '../../../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'
import { RequestConfig, Resource, ResourceType } from '../../../../../app/v2/core/integrations/interfaces/repository.interface'
import { RepositoryStrategyFactory } from '../../../../../app/v2/core/integrations/repository-strategy-factory'
import { ConsoleLoggerService } from '../../../../../app/v2/core/logs/console/console-logger.service'
import { HelmManifest } from '../../../../../app/v2/core/manifests/helm/helm-manifest'
import { ManifestConfig } from '../../../../../app/v2/core/manifests/manifest.interface'



describe('Generate K8s manifest by helm', () => {
  const basePath = path.join(__dirname, '../../../../../', 'resources/helm-test-chart')
  const manifestConfig : ManifestConfig = {
    repo: {
      provider: GitProvidersEnum.GITHUB,
      url: 'https://myrepo.com/test',
      token: 'my-token',
      branch: 'master'
    },
    componentName: 'helm-test-chart',
    imageUrl: 'latest',
    namespace: 'my-namespace',
    circleId: 'f5d23a57-5607-4306-9993-477e1598cc2a'
  }

  const repositoryStrategyFactory = mockStratetyFactory(async config => await readFiles(basePath, config.resourceName))

  it('should generate manifest with custom values', async() => {
    const helm = new HelmManifest(new ConsoleLoggerService(), repositoryStrategyFactory)
    const manifest = await helm.generate(manifestConfig)

    const expected: KubernetesManifest[] = yaml.safeLoadAll(fs.readFileSync(`${basePath}/manifest.yaml`, 'utf-8'))

    expect(manifest).toEqual(expected)
  })

  it('should fail manifest generation when fails fetching files from repository', async() => {
    const repositoryStrategyFactory = mockStratetyFactory(() => { throw new Error('error') })

    const helm = new HelmManifest(new ConsoleLoggerService(), repositoryStrategyFactory)
    const manifest = helm.generate(manifestConfig)

    expect(manifest).rejects.toThrowError()
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mockStratetyFactory(fn: (config: RequestConfig) => Promise<Resource>): RepositoryStrategyFactory {
  const gitHubRepository = new GitHubRepository(new ConsoleLoggerService(), new HttpService())
  jest.spyOn(gitHubRepository, 'getResource').mockImplementation(fn)

  const gitLabRepository = new GitLabRepository(new ConsoleLoggerService(), new HttpService())
  jest.spyOn(gitLabRepository, 'getResource').mockImplementation(fn)

  return new RepositoryStrategyFactory(gitHubRepository, gitLabRepository, new ConsoleLoggerService())
}

async function readFiles(dir: string, name: string): Promise<Resource> {
  const resources: Resource = {
    name: name,
    type: ResourceType.DIR,
    children: []
  }
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const dirent of files) {
    const filePath = path.join(dir, dirent.name)
    if (dirent.isDirectory()) {
      resources.children?.push(await readFiles(filePath, dirent.name))
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
