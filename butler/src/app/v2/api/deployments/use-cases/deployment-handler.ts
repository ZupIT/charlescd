import { JobWithDoneCallback } from 'pg-boss';
import { ConsoleLoggerService } from '../../../../v1/core/logs/console';


export class DeploymentHandler {
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService //not working but im not fighting with nest IOC now
  ) {  }

  async run(job: JobWithDoneCallback<unknown, unknown>): Promise<JobWithDoneCallback<unknown, unknown>>{
    // this.consoleLoggerService.log('Running job', { job: job })
    // eslint-disable-next-line no-constant-condition
    const cdServiceResponse = true
    if (cdServiceResponse) {
      console.log('Finished job', {job: job.id, data: job.data})
      job.done()
    } else {
      console.log('Error on job', {job: job.id, data: job.data})
      job.done(new Error('deu ruim no deploy'))
    }
    return job
  }
}
