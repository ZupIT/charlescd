import {Test} from '@nestjs/testing'
import {PipelineErrorHandlerService, PipelineQueuesService} from '../../../app/api/deployments/services'
import {
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelineQueuesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import {ConsoleLoggerService} from '../../../app/core/logs/console'
import {
    CircleDeploymentEntity,
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedDeploymentEntity,
    UndeploymentEntity
} from '../../../app/api/deployments/entity'

import {Repository} from 'typeorm'
import {StatusManagementService} from '../../../app/core/services/deployments'
import {MooveService} from '../../../app/core/integrations/moove'
import {QueuedDeploymentsRepository} from '../../../app/api/deployments/repository';
import {ComponentEntity} from '../../../app/api/components/entity';
import {
    DeploymentStatusEnum,
    QueuedPipelineStatusEnum,
    UndeploymentStatusEnum
} from '../../../app/api/deployments/enums';
import {ModuleEntity} from '../../../app/api/modules/entity';
import {IPipelineOptions} from '../../../app/api/components/interfaces';

describe('Deployments service specs', () => {
    let pipelineErrorHandlerService: PipelineErrorHandlerService
    let pipelineQueuesService: PipelineQueuesService
    let deploymentsRepository: Repository<DeploymentEntity>
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let deployment: DeploymentEntity
    let undeploymentDeployment: DeploymentEntity
    let undeployment: UndeploymentEntity
    let undeploymentFailed: UndeploymentEntity
    let deploymentFailed: DeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentEntity: ComponentEntity
    let componentEntityUpdated: ComponentEntity
    let moduleEntity: ModuleEntity
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let componentsRepository: Repository<ComponentEntity>
    let queuedDeployment: QueuedDeploymentEntity
    let circle: CircleDeploymentEntity
    let pipelineOptions: IPipelineOptions

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                PipelineErrorHandlerService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
            ]
        }).compile()


        pipelineErrorHandlerService = module.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        componentsRepository = module.get<Repository<ComponentEntity>>('ComponentEntityRepository')
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        mooveService = module.get<MooveService>(MooveService)

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag',
            'dummy-context-path',
            'dummy-health-check',
            1234
        )

        moduleDeployment = new ModuleDeploymentEntity(
            'dummy-id',
            'dummy-id',
            'helm-repository',
            [componentDeployment]
        )
        undeploymentDeployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-application-name',
            [moduleDeployment],
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            null,
            false,
            'dummy-circle-id'
        )
        undeployment = new UndeploymentEntity(
            'dummy-author-id',
            undeploymentDeployment
        )
        undeploymentFailed = new UndeploymentEntity(
            'dummy-author-id',
            undeploymentDeployment
        )
        undeploymentFailed.status = UndeploymentStatusEnum.FAILED

        circle = new CircleDeploymentEntity('dummy-circle')

        deployment = new DeploymentEntity(
            'deployment-id',
            'application-name',
            [moduleDeployment],
            'author-id',
            'description',
            'callback-url',
            circle,
            false,
            'incoming-circle-id'
        )
        deploymentFailed = new DeploymentEntity(
            'deployment-id',
            'application-name',
            [moduleDeployment],
            'author-id',
            'description',
            'callback-url',
            null,
            true,
            'incoming-circle-id'
        )
        deploymentFailed.status = DeploymentStatusEnum.FAILED
        componentEntity = new ComponentEntity(
            'component-id',
            moduleEntity
        )


        moduleEntity = new ModuleEntity(
            'module-id',
            [componentEntity]
        )
        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag',
            'dummy-context-path',
            'dummy-health-check',
            1234
        )
        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING
        )
        componentEntity = new ComponentEntity(
            'component-id',
            moduleEntity
        )
        componentEntityUpdated = new ComponentEntity(
            'component-id',
            moduleEntity
        )

        pipelineOptions = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
        componentEntity.pipelineOptions =  pipelineOptions

    })

    describe('handleDeploymentFailure', () => {
        it('should execute handle deployment failure', async () => {
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleDeploymentFailure(deployment)
            expect(mooveServiceSpy).toHaveBeenCalled()
        })

        it('should  execute nothing when deployment has status failed', async () => {

            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleDeploymentFailure(deploymentFailed)
            expect(mooveServiceSpy).not.toHaveBeenCalled()
        })
        it('should  execute nothing when are no deployment', async () => {

            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleDeploymentFailure(undefined)
            expect(mooveServiceSpy).not.toHaveBeenCalled()
        })
    })
    describe('handleUndeploymentFailure', () => {
        it('should  execute undeployment failure', async () => {
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleUndeploymentFailure(undeployment)
            expect(mooveServiceSpy).toHaveBeenCalled()

        })
        it('should not execute undeployment failure with status failed', async () => {
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleUndeploymentFailure(undeploymentFailed)
            expect(mooveServiceSpy).not.toHaveBeenCalled()

        })
    })
})
