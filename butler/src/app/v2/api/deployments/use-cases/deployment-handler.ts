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

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobWithDoneCallback } from 'pg-boss';
import { In, Repository, UpdateResult } from 'typeorm';
import { ConsoleLoggerService } from '../../../../v1/core/logs/console';
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity';
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity';
import { PgBossWorker } from '../jobs/pgboss.worker';
import { Execution } from '../entity/execution.entity';


@Injectable()
export class DeploymentHandler {
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @InjectRepository(ComponentEntity)
    private componentsRepository: Repository<ComponentEntity>,
    @InjectRepository(DeploymentEntity)
    private deploymentsRepository: Repository<DeploymentEntity>,
    @Inject(forwardRef(() => PgBossWorker))
    private pgBoss: PgBossWorker
  ) { }

  async run(job: JobWithDoneCallback<Execution, unknown>): Promise<JobWithDoneCallback<Execution, unknown>> {
    const deployment = await this.deploymentFromExecution(job.data)
    if (!deployment) {
      const error = new Error('Deployment not found')
      job.done(error)
      this.consoleLoggerService.log('DeploymentHandler error', { job: job })
      throw error
    }
    const componentsOverlap = await this.checkForRunningComponents(deployment)
    if (componentsOverlap.length > 0) {
      this.pgBoss.publish(job.data)
      job.done()
      this.consoleLoggerService.log('Overlapping components, requeing the job', { job: job })
    } else {
      const deploymentComponents = await this.findComponentsByName(deployment)
      await this.updateComponentsToRunning(deploymentComponents)
      job.done()
      this.consoleLoggerService.log('Updated components to running', { job: job })
    }
    return job
  }

  async deploymentFromExecution(execution: Execution): Promise<DeploymentEntity | undefined> {
    return await this.deploymentsRepository.findOne({ where: { id: execution.deployment.id }, relations: ['components'] })
  }

  async findComponentsByName(deployment: DeploymentEntity): Promise<ComponentEntity[]> {
    const names = deployment.components.map(c => c.name)
    return await this.componentsRepository.find({ where: { name: In(names), deployment: deployment } })
  }

  async updateComponentsToRunning(components: ComponentEntity[]): Promise<UpdateResult> { // TODO extract all these database methods to custom repo/class
    const componentsIds = components.map(c => c.id)
    const updated = await this.componentsRepository.update(componentsIds, { running: true })
    return updated
  }

  async checkForRunningComponents(deployment: DeploymentEntity): Promise<ComponentEntity[]> {
    const deploymentComponents = await this.findComponentsByName(deployment)
    const allRunningComponents = await this.componentsRepository.find({ where: { running: true } })
    const overlap = allRunningComponents.filter( c => deploymentComponents.some(dc => dc.name === c.name))
    return overlap
  }
}
