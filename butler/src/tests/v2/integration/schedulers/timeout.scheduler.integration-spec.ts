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
import { KubernetesObject } from '@kubernetes/client-node/dist/types'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import * as http from 'http'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

describe('TimeoutScheduler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let timeoutScheduler: TimeoutScheduler
  let k8sClient: K8sClient
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
    k8sClient = app.get<K8sClient>(K8sClient)
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

  it('deletes the CharlesDeployment resource associated with a deployment that timed out with no previous', async() => {
    const deleteSpy = jest.spyOn(k8sClient, 'applyUndeploymentCustomResource')
      .mockImplementation(() => Promise.resolve())

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

    const expectedDeployment = await manager.findOneOrFail(DeploymentEntityV2, { where: { id: savedDeployment.id } })
    expect(deleteSpy).toHaveBeenCalledWith(expectedDeployment)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
  })

  it('should set the previous deployment as the current and update the CRD in case of timeout', async() => {
    const updateSpy = jest.spyOn(k8sClient, 'applyDeploymentCustomResource')
      .mockImplementation(() => Promise.resolve())

    const previousDeployment = deploymentFixture
    previousDeployment.id = 'a62ce3b9-3029-42a8-9153-ace7a4d632bf'
    previousDeployment.current = false
    const savedPreviousDeployment = await manager.save(DeploymentEntityV2, previousDeployment)
    const previousExecution = new Execution(savedPreviousDeployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.SUCCEEDED)
    await manager.save(Execution, previousExecution)

    const currentDeployment = deploymentFixture
    currentDeployment.id = '18759ea9-b360-4739-918c-6f607710668e'
    currentDeployment.previousDeploymentId = previousDeployment.id
    currentDeployment.current = true
    const savedCurrentDeployment = await manager.save(DeploymentEntityV2, currentDeployment)
    const currentExecution = new Execution(savedCurrentDeployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.CREATED)
    const currentSavedExecution = await manager.save(Execution, currentExecution)

    // Set created_at column on execution older than deployment timeout
    const createdAt = DateUtils.now()
    createdAt.setSeconds(createdAt.getSeconds() - currentDeployment.timeoutInSeconds * 2)
    await manager.update(Execution, currentSavedExecution.id, { createdAt: createdAt })

    await timeoutScheduler.handleCron()
    const deploymentExecution = await manager.findOneOrFail(Execution, { where: { deploymentId: savedCurrentDeployment.id } })
    expect(deploymentExecution.status).toEqual(DeploymentStatusEnum.TIMED_OUT)

    const expectedPreviousDeployment = await manager.findOneOrFail(DeploymentEntityV2, { where: { id: previousDeployment.id } })
    expect(expectedPreviousDeployment.current).toBe(true)

    const expectedTimedOutDeployment = await manager.findOneOrFail(DeploymentEntityV2, { where: { id: currentDeployment.id } })
    expect(expectedTimedOutDeployment.current).toBe(false)

    expect(updateSpy).toHaveBeenCalledWith(expectedPreviousDeployment)
    expect(updateSpy).toHaveBeenCalledTimes(1)
  })
})
