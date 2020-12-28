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

import { ManifestConfig, RepoConfig } from '../../../core/manifests/manifest.interface'
import { KubernetesManifest } from '../../../core/integrations/interfaces/k8s-manifest.interface'
import { IDefaultConfig } from '../../configurations/interfaces/octopipe-configuration-data.type'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'
import { HelmManifest } from '../../../core/manifests/helm/helm-manifest'

export class ManifestResolver {

  constructor(private readonly manifest: HelmManifest) {}
  
  public async resolve(
    cdConfiguration: IDefaultConfig, 
    circleId: string, 
    repoUrl: string, 
    componentDto: CreateComponentRequestDto
  ): Promise<KubernetesManifest[]> {
    const repoConfig = this.getRepoConfig(cdConfiguration, repoUrl) 
    const manifestConfig = this.getManifestConfig(repoConfig, cdConfiguration.namespace, circleId, componentDto)
    return this.manifest.generate(manifestConfig) 
  }

  private getManifestConfig(repoConfig: RepoConfig, 
    namespace: string, 
    circleId: string, 
    componentDto: CreateComponentRequestDto
  ): ManifestConfig {
    return {
      repo: repoConfig,
      componentName: componentDto.componentName,
      imageUrl: componentDto.buildImageUrl,
      namespace: namespace,
      circleId: circleId
    }
  }

  private getRepoConfig(config: IDefaultConfig, repoUrl: string): RepoConfig {
    return {
      provider: config.gitProvider,
      url: repoUrl,
      token: config.gitToken,
      branch: 'master' // TODO obter branch
    }
  }
}
