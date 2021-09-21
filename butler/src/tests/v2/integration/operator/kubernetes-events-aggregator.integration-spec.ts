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

import 'jest'
import * as http from 'http'

import { EventsLogsAggregator } from '../../../../app/v2/operator/logs-aggregator/kubernetes-events-aggregator'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import { KubernetesObject } from '@kubernetes/client-node'
import { LogRepository } from '../../../../app/v2/api/deployments/repository/log.repository'
import { LogEntity } from '../../../../app/v2/api/deployments/entity/logs.entity'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../app/app.module'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { INestApplication } from '@nestjs/common'
import { IncomingMessage } from 'http'
import {
  deploymentWithoutComponentFixture, otherDeploymentWithoutComponentFixture
} from '../../fixtures/deployment-entity.fixture'
import { EntityManager } from 'typeorm'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { AppConstants } from '../../../../app/v2/core/constants'

type K8sClientResolveObject = { body: KubernetesObject, response: http.IncomingMessage }

describe('Aggregate events from kubernetes to charles logs', () => {

  let k8sClient: K8sClient
  let logRepository: LogRepository
  let deploymentsRepository: DeploymentRepositoryV2
  let app: INestApplication
  let manager: EntityManager
  let fixtureUtilsService: FixtureUtilsService
  const butlerNamespace = 'butler-namespace'
  const logService = new ConsoleLoggerService()
  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService,
        DeploymentRepositoryV2
      ]
    })
    app =  await TestSetupUtils.createApplication(module)
    deploymentsRepository = app.get<DeploymentRepositoryV2>(DeploymentRepositoryV2)
    logRepository = app.get<LogRepository>(LogRepository)
    k8sClient = new K8sClient(logService, { butlerNamespace: butlerNamespace } as IEnvConfiguration)
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    manager = fixtureUtilsService.connection.manager
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })


  it('should aggregate CharlesRoutes events from current deployment', async() => {
    //create current deployment
    const deployment: DeploymentEntityV2 = deploymentWithoutComponentFixture()
    deployment.current = true
    deployment.circleId = 'circle-id-2'
    await deploymentsRepository.save(deployment)

    const oldDeployment: DeploymentEntityV2 = otherDeploymentWithoutComponentFixture()
    oldDeployment.circleId = 'circle-id'
    oldDeployment.current = false
    oldDeployment.id = '03699ca6-7262-4369-a403-fdfae1b6c04d'
    await manager.save(oldDeployment)

    await manager.findOneOrFail(DeploymentEntityV2, oldDeployment.id)
    jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          kind: AppConstants.CHARLES_CUSTOM_RESOURCE_ROUTES_KIND,
          metadata: {
            name: 'charles-routes'
          },
          spec: {
            circles: [{
              id: 'circle-id',
              component: 'dragonboarding',
              tag: 'v2'
            },
            {
              id: 'circle-id-2',
              component: 'dragonboarding',
              tag: 'v1'
            }]
          }
        },
        response: {} as IncomingMessage
      } as K8sClientResolveObject ) )
    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-09-16T11:54:20Z')
      },
      involvedObject: {
        namespace: 'charles',
        kind: 'CharlesRoutes',
        apiVersion: 'charlescd.io/v1',
        name: 'charles-routes'
      },
      reason: 'SyncError',
      message: 'Sync error: discovery: cant find resource virtualservices in apiVersion networking.istio.io/v1alpha3',
      type: 'Warning',
    }
    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent)
    const logEntity = await manager.find(LogEntity, { where: { deploymentId: deployment.id } })
    const logDetails = JSON.stringify({
      message: coreEvent.message,
      object: `${coreEvent.involvedObject.kind}/${coreEvent.involvedObject.name}`
    })
    expect(logEntity.length).toBe(1)
    expect(logEntity[0].deploymentId).toBe(deployment.id)
    expect(logEntity[0].logs[0].title).toBe(coreEvent.reason)
    expect(logEntity[0].logs[0].details).toBe(logDetails)
  })

  it('should not aggregate CharlesRoutes events when deployment is not current', async() => {

    const deployment: DeploymentEntityV2 = deploymentWithoutComponentFixture()
    deployment.circleId = 'circle-id'
    deployment.current = false
    await manager.save(deployment)

    jest.spyOn(k8sClient, 'readResource')
      .mockImplementation(() => Promise.resolve({
        body: {
          kind: AppConstants.CHARLES_CUSTOM_RESOURCE_ROUTES_KIND,
          metadata: {
            name: 'charles-routes'
          },
          spec: {
            circles: [{
              id: 'circle-id',
              component: 'dragonboarding',
              tag: 'v1'
            }]
          }
        },
        response: {} as IncomingMessage
      } as K8sClientResolveObject))
    const coreEvent = {
      metadata: {
        creationTimestamp: new Date('2021-09-16T11:54:20Z')
      },
      involvedObject: {
        namespace: 'charles',
        kind: 'CharlesRoutes',
        apiVersion: 'charlescd.io/v1',
        name: 'charles-routes'
      },
      reason: 'SyncError',
      message: 'Sync error: discovery: cant find resource virtualservices in apiVersion networking.istio.io/v1alpha3',
      type: 'Warning',
    }
    const eventsLogsAggregator = new EventsLogsAggregator(k8sClient, logRepository, logService, deploymentsRepository)
    await eventsLogsAggregator.aggregate(coreEvent)
    const logEntity = await manager.find(LogEntity, { where: { deploymentId: deployment.id } })
    expect(logEntity.length).toBe(0)
  })
})