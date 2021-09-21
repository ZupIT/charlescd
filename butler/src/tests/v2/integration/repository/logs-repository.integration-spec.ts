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
import { Test } from '@nestjs/testing'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabasesService } from '../../../../app/v2/core/integrations/databases'
import { Configuration } from '../../../../app/v2/core/config/configurations'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { LogRepository } from '../../../../app/v2/api/deployments/repository/log.repository'
import { INestApplication } from '@nestjs/common'
import {
  deploymentFixture,
  deploymentWithoutComponentFixture
} from '../../fixtures/deployment-entity.fixture'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ComponentsRepositoryV2 } from '../../../../app/v2/api/deployments/repository'
import { ExecutionRepository } from '../../../../app/v2/api/deployments/repository/execution.repository'

describe('save logs  to log repository', () => {
  let logRepository: LogRepository
  let deploymentsRepository: DeploymentRepositoryV2
  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await TypeOrmModule.forRootAsync({
          useFactory: () => (
            DatabasesService.getPostgresConnectionOptions(Configuration)
          )
        }),
        TypeOrmModule.forFeature([
          DeploymentEntity,
          Execution,
          ComponentsRepositoryV2,
          ExecutionRepository,
          DeploymentRepositoryV2,
          LogRepository
        ])
      ],
      providers: [
        FixtureUtilsService,
        ConsoleLoggerService
      ]
    })

    TestSetupUtils.seApplicationConstants()
    app = await TestSetupUtils.createApplication(module)
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    deploymentsRepository = app.get<DeploymentRepositoryV2>(DeploymentRepositoryV2)
    logRepository = app.get<LogRepository>(LogRepository)
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('if fails to save one log should rollback all', async() => {
    const deployment = deploymentFixture
    await deploymentsRepository.save(deployment)
    const deploymentNotSaved = deploymentWithoutComponentFixture()
      
    const deploymentsId = [deployment.id, deploymentNotSaved.id]
    const log = {
      type: 'INFO',
      title: 'log-title',
      details: 'log-details',
      timestamp: Date.now().toString()
    }
    await expect(logRepository.saveDeploymentsLogs(deploymentsId, log)).rejects.toThrow()
    const logs = await logRepository.find()
    expect(logs.length).toBe(0)
  })

  it('should save logs from all deployments', async() => {
    const deployment = deploymentFixture
    await deploymentsRepository.save(deployment)
    const deploymentNotSaved = deploymentWithoutComponentFixture()
    await deploymentsRepository.save(deploymentNotSaved)
    const deploymentsId = [deploymentNotSaved.id, deployment.id]
    const log = {
      type: 'INFO',
      title: 'log-title',
      details: 'log-details',
      timestamp: Date.now().toString()
    }
    await logRepository.saveDeploymentsLogs(deploymentsId, log)
    const logs = await logRepository.find()
    expect(logs.length).toBe(2)
  })

})