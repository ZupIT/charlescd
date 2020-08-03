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

import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JobWithDoneCallback } from 'pg-boss'
import { In, Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { ComponentEntityV2 as ComponentEntity } from '../entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { Execution } from '../entity/execution.entity'
import { PgBossWorker } from '../jobs/pgboss.worker'
import { SpinnakerConnector } from '../../../core/integrations/spinnaker/connector'
import { flatMap } from 'lodash'
import { CdConfigurationsRepository } from '../../../../v1/api/configurations/repository'
import { ComponentsRepositoryV2 } from '../repository'

@Injectable()
export class DeploymentHandler {
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @InjectRepository(ComponentsRepositoryV2)
    private componentsRepository: ComponentsRepositoryV2,
    @InjectRepository(DeploymentEntity)
    private deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(CdConfigurationsRepository)
    private cdConfigurationsRepository: CdConfigurationsRepository,
    @Inject(forwardRef(() => PgBossWorker))
    private pgBoss: PgBossWorker,
    private spinnakerConnector: SpinnakerConnector
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
      this.consoleLoggerService.log('Overlapping components, requeing the job', { job: job })
    } else {
      this.consoleLoggerService.log('START:RUN_EXECUTION')
      const activeComponents = await this.componentsRepository.findActiveComponents()
      this.consoleLoggerService.log('GET:ACTIVE_COMPONENTS', { activeComponents })
      const cdResponse = await this.spinnakerConnector.createDeployment(deployment, activeComponents)
      if (cdResponse.status === 'SUCCEEDED') {
        await this.updateComponentsToRunning(deployment)
        this.consoleLoggerService.log('FINISH:RUN_EXECUTION Updated components to running', { job: job })
        job.done()
      } else {
        this.consoleLoggerService.log('FINISH:RUN_EXECUTION CD Response error', { job: job, error: cdResponse.error })
        job.done(new Error(cdResponse.error))
      }
    }
    return job
  }

  async deploymentFromExecution(execution: Execution): Promise<DeploymentEntity | undefined> {
    const deployment = await this.deploymentsRepository.findOne({ where: { id: execution.deployment.id }, relations: ['components', 'cdConfiguration'] })

    if (deployment)
      deployment.cdConfiguration = await this.cdConfigurationsRepository.findDecrypted(deployment.cdConfiguration.id)

    return deployment
  }

  async findComponentsByName(deployment: DeploymentEntity): Promise<ComponentEntity[]> {
    const names = deployment.components.map(c => c.name)
    return await this.componentsRepository.find({ where: { name: In(names), deployment: deployment } })
  }

  async updateComponentsToRunning(deployment: DeploymentEntity): Promise<DeploymentEntity> { // TODO extract all these database methods to custom repo/class
    deployment.components = deployment.components.map(c => {
      c.running = true
      return c
    })
    const updated = await this.deploymentsRepository.save(deployment, { reload: true })
    return updated
  }

  async checkForRunningComponents(deployment: DeploymentEntity): Promise<ComponentEntity[]> {
    const deploymentComponents = await this.findComponentsByName(deployment)
    const allRunningComponents = await this.componentsRepository.find({ where: { running: true } })
    const overlap = allRunningComponents.filter( c => deploymentComponents.some(dc => dc.name === c.name))
    return overlap
  }
}
