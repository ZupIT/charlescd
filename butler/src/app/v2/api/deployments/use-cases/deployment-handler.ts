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


@Injectable()
export class DeploymentHandler {
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @InjectRepository(ComponentEntity)
    private componentsRepository: Repository<ComponentEntity>,
    @Inject(forwardRef(() => PgBossWorker))
    private pgBoss: PgBossWorker
  ) { }

  async run(job: JobWithDoneCallback<unknown, unknown>): Promise<JobWithDoneCallback<unknown, string>> {
    const cdServiceResponse = true
    const dataAsDeployment = job.data as DeploymentEntity
    if (cdServiceResponse) {
      this.consoleLoggerService.log('Finished job', { job: job.id, data: dataAsDeployment })
      const componentNames = dataAsDeployment.components.map(c => c.name)
      const componentsOverlap = await this.checkForRunningComponents(componentNames, dataAsDeployment)
      const deploymentComponents = await this.findComponentsByName(componentNames, dataAsDeployment)
      if (componentsOverlap) {
        this.pgBoss.publish(dataAsDeployment)
        // job.done()
      }
      await this.updateComponentsToRunning(deploymentComponents)
      job.done()
    } else {
      this.consoleLoggerService.log('Error on job', { job: job.id, data: job.data })
      job.done(new Error('deu ruim no deploy'))
    }
    return job
  }

  async findComponentsByName(names: string[], deployment: DeploymentEntity): Promise<ComponentEntity[]> {
    return await this.componentsRepository.find({ where: { name: In(names), deployment: deployment } })
  }

  async updateComponentsToRunning(components: ComponentEntity[]): Promise<UpdateResult> {
    const componentsIds = components.map(c => c.id)
    const updated = await this.componentsRepository.update(componentsIds, { running: true })
    return updated
  }

  async checkForRunningComponents(names: string[], deployment: DeploymentEntity): Promise<ComponentEntity[]> {
    const deploymentComponents = await this.findComponentsByName(names, deployment)
    const allRunningComponents = await this.componentsRepository.find({ where: { running: true } })
    const overlap = allRunningComponents.filter(n => deploymentComponents.includes(n))
    return overlap
  }
}
