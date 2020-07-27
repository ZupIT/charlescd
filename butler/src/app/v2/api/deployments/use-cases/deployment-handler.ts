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

import { JobWithDoneCallback } from 'pg-boss';
import { ConsoleLoggerService } from '../../../../v1/core/logs/console';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeploymentHandler {
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService //not working but im not fighting with nest IOC now
  ) {  }

  async run(job: JobWithDoneCallback<unknown, unknown>): Promise<JobWithDoneCallback<unknown, unknown>>{
    const cdServiceResponse = false
    if (cdServiceResponse) {
      this.consoleLoggerService.log('Finished job', {job: job.id, data: job.data})
      job.done()
    } else {
      this.consoleLoggerService.log('Error on job', {job: job.id, data: job.data})
      job.done(new Error('deu ruim no deploy'))
    }
    return job
  }
}
