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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsoleLoggerService } from '../../../../v1/core/logs/console';
import { DeploymentEntity } from '../entity/deployment.entity';
import { PgBossWorker } from '../jobs/pgboss.worker';

@Injectable()
export class DeploymentUseCase {
  constructor(
    @InjectRepository(DeploymentEntity)
    private deploymentRepository: Repository<DeploymentEntity>,
    private pgBoss: PgBossWorker,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) {

  }

  public async save(deployment: DeploymentEntity): Promise<DeploymentEntity> {
    const deploymentEntity =  await this.deploymentRepository.save(deployment)
    const jobId = await this.pgBoss.publish(deployment)
    this.consoleLoggerService.log('Publishing new deployment job', {jobId: jobId, deployment: deploymentEntity.id})
    return deploymentEntity
  }
}
