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
import { GitProvidersEnum } from '../configuration/interfaces/git-providers.type'
import { ConsoleLoggerService } from '../logs/console/console-logger.service'
import { GitHubRepository } from './github/github-repository'
import { GitLabRepository } from './gitlab/gitlab-repository'
import { Repository } from './interfaces/repository.interface'

@Injectable()
export class RepositoryStrategyFactory {

  constructor(
    private readonly gitHubRepository: GitHubRepository,
    private readonly gitLabRepository: GitLabRepository,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) {}

  public create(type: GitProvidersEnum): Repository {
    switch (type) {
      case GitProvidersEnum.GITHUB:
        return this.gitHubRepository
      case GitProvidersEnum.GITLAB:
        return this.gitLabRepository
      default:
        this.consoleLoggerService.error('ERROR:INVALID_REPO_TYPE_VALUE', type)
        throw new Error('invalid repository type value')
    }
  }
}
