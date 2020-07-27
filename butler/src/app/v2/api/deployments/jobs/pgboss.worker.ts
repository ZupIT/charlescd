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

import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc';
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface';
import { ConsoleLoggerService } from '../../../../v1/core/logs/console';
import { DeploymentEntity } from '../entity/deployment.entity';
import { DeploymentHandler } from '../use-cases/deployment-handler';
import PgBoss = require('pg-boss');

@Injectable()
export class PgBossWorker implements OnModuleInit, OnModuleDestroy{
  public pgBoss: PgBoss
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly deploymentHandler: DeploymentHandler,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    envConfiguration: IEnvConfiguration,
  ) {
    this.pgBoss = new PgBoss(envConfiguration.pgBossConfig)
  }

  publish(params: DeploymentEntity) : Promise<string| null>{
    return this.pgBoss.publish('deployment-queue', params)
  }

  async onModuleInit(): Promise<void> {
    this.consoleLoggerService.log('Starting pgboss')
    await this.pgBoss.start()
    this.pgBoss.on('error', (error) => {
      console.log('pg-boss error', error)
    })

    await this.pgBoss.subscribe('deployment-queue', async(job) => {
      await this.deploymentHandler.run(job)
    })
  }

  async onModuleDestroy(): Promise<void>{
    this.consoleLoggerService.log('Shutting down onModuleDestroy')
    return await this.pgBoss.stop()
  }
}
