import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { DeploymentStatusEnum } from '../../../../app/v1/api/deployments/enums'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity, DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'
import { DeploymentHandler } from '../../../../app/v2/api/deployments/use-cases/deployment-handler'
import { FixtureUtilsService } from '../../utils/fixture-utils.service'
import { TestSetupUtils } from '../../utils/test-setup-utils'

describe('DeploymentHandler', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let worker: PgBossWorker
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

  it('set only one component deployment status to running', async() => {
    const manager = fixtureUtilsService.connection.manager
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )

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

    const components = params.components.map(c => {
      return new ComponentEntity(
        c.helmRepository,
        c.buildImageTag,
        c.buildImageUrl,
        c.componentName,
        c.componentId)
    })

    const firstDeploymentEntity = new DeploymentEntity(
      params.deploymentId,
      params.authorId,
      DeploymentStatusEnum.CREATED,
      params.circle,
      cdConfiguration,
      params.callbackUrl,
      components
    )
    const secondsDeploymentEntity = new DeploymentEntity(
      params.deploymentId,
      params.authorId,
      DeploymentStatusEnum.CREATED,
      params.circle,
      cdConfiguration,
      params.callbackUrl,
      components
    )

    await manager.save(cdConfiguration)
    const firstDeployment = await manager.save(firstDeploymentEntity)
    const secondDeployment = await manager.save(secondsDeploymentEntity)

    const deploymentHandler =  app.get<DeploymentHandler>(DeploymentHandler)
    const queue = 'deployment-queue'

    await worker.pgBoss.publish(queue, firstDeployment)

    await worker.pgBoss.subscribe(queue, async(job) => {
      await deploymentHandler.run(job)
      await worker.pgBoss.onComplete(job.id, async() => {
        const jobDeployment = job.data as DeploymentEntityV2
        const handledDeployment = await manager.findOneOrFail(DeploymentEntity, {id: jobDeployment.id}, { relations: ['components']})
        expect(handledDeployment.components[0].running).toEqual(false)
      })
    })

    await worker.pgBoss.publish(queue, secondDeployment)

    await worker.pgBoss.subscribe(queue, async(job) => {
      await deploymentHandler.run(job)
      await worker.pgBoss.onComplete(job.id, async() => { // TODO: THIS IS NOT WORKING
        const jobDeployment = job.data as DeploymentEntityV2
        const handledDeployment = await manager.findOneOrFail(DeploymentEntity, {id: jobDeployment.id}, { relations: ['components']})
        expect(handledDeployment.components[0].running).toEqual(false)
      })
    })

    // const currentJobs = await worker.pgBoss.fetch(queue)
    // if (!currentJobs) {
    //   fail('Queue is empty')
    // }
    // const jobData = currentJobs.data as DeploymentEntity
    // expect(jobData.components).toEqual(params.components)

  })
})
