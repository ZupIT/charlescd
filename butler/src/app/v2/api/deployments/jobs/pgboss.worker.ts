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

import { forwardRef, Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JobWithDoneCallback } from 'pg-boss'
import { Repository } from 'typeorm'
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc'
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { DeploymentEntityV2 } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { DeploymentCleanupHandler } from '../use-cases/deployment-cleanup-handler'
import { DeploymentHandler } from '../use-cases/deployment-handler'
import PgBoss = require('pg-boss');

const EXPIRE_IN_MINUTES = 25 // TODO move to config

@Injectable()
export class PgBossWorker implements OnModuleInit, OnModuleDestroy {
  public pgBoss: PgBoss
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private deploymentCleanupHandler: DeploymentCleanupHandler,
    @Inject(forwardRef(() => DeploymentHandler))
    private readonly deploymentHandler: DeploymentHandler,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    envConfiguration: IEnvConfiguration,
    @InjectRepository(DeploymentEntityV2)
    private deploymentRepository: Repository<DeploymentEntityV2>,

  ) {
    this.pgBoss = new PgBoss(envConfiguration.pgBossConfig)
  }

  public publish(params: Execution): Promise<string | null> {
    return this.pgBoss.publish('deployment-queue', params, { expireInMinutes: EXPIRE_IN_MINUTES })
  }

  public async publishWithPriority(params: Execution): Promise<string | null> {
    await this.deploymentRepository.increment({ id: params.deployment.id }, 'priority', 1) // execution priority column
    const incrementedDeployment = await this.deploymentRepository.findOneOrFail({ id: params.deployment.id })
    const incPriority = incrementedDeployment.priority // pg-boss priority column
    return this.pgBoss.publish('deployment-queue', params, { priority: incPriority, expireInMinutes: EXPIRE_IN_MINUTES })
  }

  public async onModuleInit(): Promise<void> {
    this.consoleLoggerService.log('Starting pgboss')
    await this.pgBoss.start()
    this.pgBoss.on('error', (error) => {
      this.consoleLoggerService.log('pg-boss error', error)
    })

    await this.pgBoss.subscribe('deployment-queue', async(job: JobWithDoneCallback<Execution, unknown>) => {
      await this.deploymentHandler.run(job)
    })

    await this.pgBoss.schedule('deployment-cleanup', '* * * * *', undefined, undefined)
    await this.pgBoss.subscribe('deployment-cleanup', async(job: JobWithDoneCallback<unknown, unknown>) => {
      await this.deploymentCleanupHandler.run(job)
    })
  }

  public async onModuleDestroy(): Promise<void> {
    this.consoleLoggerService.log('Shutting down onModuleDestroy')
    return await this.pgBoss.stop()
  }
}
