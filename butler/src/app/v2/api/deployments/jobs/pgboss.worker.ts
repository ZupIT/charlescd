import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Configuration } from '../../../../v1/core/config/configurations';
import { ConsoleLoggerService } from '../../../../v1/core/logs/console';
import { DeploymentEntity } from '../entity/deployment.entity';
import PgBoss = require('pg-boss');
import { DeploymentHandler } from '../use-cases/deployment-handler';

@Injectable()
export class PgBossWorker implements OnModuleInit, OnModuleDestroy{
  pgBoss: PgBoss
  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    private readonly deploymentHandler: DeploymentHandler
  ) {
    const pgBossOptions = {
      host: Configuration.postgresHost,
      database: Configuration.postgresDbName,
      user: Configuration.postgresUser,
      password: Configuration.postgresPass,
      max: 5,
      retentionDays: 7
    };
    this.pgBoss = new PgBoss(pgBossOptions)
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
