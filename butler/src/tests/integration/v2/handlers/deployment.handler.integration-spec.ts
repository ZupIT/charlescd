/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { DeploymentHandler } from '../../../../app/v2/api/deployments/use-cases/deployment-handler'
import { FixtureUtilsService } from '../../utils/fixture-utils.service'
import { TestSetupUtils } from '../../utils/test-setup-utils'
import { JobWithDoneCallback } from 'pg-boss'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { DeploymentUseCase } from '../../../../app/v2/api/deployments/use-cases/deployment-use-case'

describe('DeploymentHandler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let worker: PgBossWorker
  let deploymentHandler: DeploymentHandler
  let deploymentUseCase: DeploymentUseCase
  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService
      ]
    })

    app = await TestSetupUtils.createApplication(module)
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    worker = app.get<PgBossWorker>(PgBossWorker)
    deploymentHandler = app.get<DeploymentHandler>(DeploymentHandler)
    deploymentUseCase = app.get<DeploymentUseCase>(DeploymentUseCase)
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
    await worker.pgBoss.stop()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
  })

  it('set only one component deployment status to running, set the second to running when the first is finished', async() => {
    const manager = fixtureUtilsService.connection.manager
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await manager.save(cdConfiguration)

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment'
    }

    const firstFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const firstDeployment = firstFixtures.deployment
    const firstJob = firstFixtures.job

    const secondFixtures = await createDeploymentAndExecution(params, cdConfiguration, manager)
    const secondDeployment = secondFixtures.deployment
    const secondJob = secondFixtures.job


    await deploymentHandler.run(firstJob)
    await deploymentHandler.run(secondJob)

    const handledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: firstDeployment.id } })
    const notHandledDeployment = await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: secondDeployment.id } })

    expect(handledDeployment.components.map(c => c.running)).toEqual([true])
    expect(notHandledDeployment.components.map(c => c.running)).toEqual([false])

    await deploymentUseCase.updateStatus(firstDeployment.id, DeploymentStatusEnum.SUCCEEDED)
    await deploymentHandler.run(secondJob)

    expect(notHandledDeployment.components.map(c => c.running)).toEqual([true])
  })
})

const createDeploymentAndExecution = async(params: any, cdConfiguration: CdConfigurationEntity, manager: any) => {
  const components = params.components.map((c: any) => {
    return new ComponentEntity(
      c.helmRepository,
      c.buildImageTag,
      c.buildImageUrl,
      c.componentName,
      c.componentId)
  })

  const deployment = await manager.save(new DeploymentEntity(
    params.deploymentId,
    params.authorId,
    DeploymentStatusEnum.CREATED,
    params.circle,
    cdConfiguration,
    params.callbackUrl,
    components
  ))

  const execution = await manager.save(new Execution(
    deployment,
    'DEPLOYMENT'
  ))

  const job : JobWithDoneCallback<Execution, unknown> = {
    data: execution,
    done: () => ({}),
    id: 'job-id',
    name: 'job-name'
  }

  return {
    deployment,
    execution,
    job
  }
}
