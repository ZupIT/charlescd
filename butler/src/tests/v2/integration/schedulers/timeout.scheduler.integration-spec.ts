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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { DateUtils } from '../../../../app/v2/core/utils/date.utils'
import { TimeoutScheduler } from '../../../../app/v2/operator/cron/timeout.scheduler'
import { deploymentFixture } from '../../fixtures/deployment-entity.fixture'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'

describe('TimeoutScheduler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let timeoutScheduler: TimeoutScheduler
  let manager: EntityManager
  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService
      ]
    })

    app = await TestSetupUtils.createApplication(module)
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    timeoutScheduler = app.get<TimeoutScheduler>(TimeoutScheduler)
    manager = fixtureUtilsService.connection.manager
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  afterEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('updates old unresolved deployments', async() => {
    const deployment = deploymentFixture
    deployment.current = true
    const savedDeployment = await manager.save(DeploymentEntityV2, deployment)
    const execution = new Execution(savedDeployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    const savedExecution = await manager.save(Execution, execution)

    // Set created_at column on execution older than deployment timeout
    const createdAt = DateUtils.now()
    createdAt.setSeconds(createdAt.getSeconds() - deployment.timeoutInSeconds * 2)
    await manager.update(Execution, savedExecution.id, { createdAt: createdAt })


    await timeoutScheduler.handleCron()
    const deploymentExecution = await manager.findOneOrFail(Execution, { where: { deploymentId: savedDeployment.id } })
    expect(deploymentExecution.status).toEqual(DeploymentStatusEnum.TIMED_OUT)
  })

  it('does not update deployment that has not timed_out yet', async() => {
    const deployment = deploymentFixture
    deployment.current = true
    const savedDeployment = await manager.save(DeploymentEntityV2, deployment)
    const execution = new Execution(savedDeployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    await manager.save(Execution, execution)

    await timeoutScheduler.handleCron()
    const deploymentExecution = await manager.findOneOrFail(Execution, { where: { deploymentId: savedDeployment.id } })
    expect(deploymentExecution.status).toEqual(DeploymentStatusEnum.CREATED)
  })

  it('does not update deployment that has passed the time_out time window but is already healthy and routed', async() => {
    const deployment = deploymentFixture
    deployment.current = true
    deployment.healthy = true
    deployment.routed = true
    const savedDeployment = await manager.save(DeploymentEntityV2, deployment)
    const execution = new Execution(savedDeployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    const savedExecution = await manager.save(Execution, execution)

    // Set created_at column on execution older than deployment timeout
    const createdAt = DateUtils.now()
    createdAt.setSeconds(createdAt.getSeconds() - deployment.timeoutInSeconds * 2)
    await manager.update(Execution, savedExecution.id, { createdAt: createdAt })


    await timeoutScheduler.handleCron()
    const deploymentExecution = await manager.findOneOrFail(Execution, { where: { deploymentId: savedDeployment.id } })
    expect(deploymentExecution.status).toEqual(DeploymentStatusEnum.CREATED)
  })
})
