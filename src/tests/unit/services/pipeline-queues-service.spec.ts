import { Test } from '@nestjs/testing'
import {
    PipelineDeploymentsService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelineDeploymentsServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import {
    ComponentDeploymentsRepositoryStub,
    ComponentsRepositoryStub,
    ComponentUndeploymentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub,
    QueuedDeploymentsRepositoryStub,
    QueuedUndeploymentsRepositoryStub,
    UndeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ComponentDeploymentsRepository,
    ComponentUndeploymentsRepository,
    QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import {
    CircleDeploymentEntity,
    ComponentDeploymentEntity,
    ComponentUndeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    ModuleUndeploymentEntity,
    QueuedDeploymentEntity,
    QueuedUndeploymentEntity,
    UndeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { MooveService } from '../../../app/core/integrations/moove'
import { ComponentEntity } from '../../../app/api/components/entity'
import { ModuleEntity } from '../../../app/api/modules/entity'

describe('PipelineQueuesService', () => {

    let pipelineQueuesService: PipelineQueuesService
    let queuedUndeploymentsRepository: Repository<QueuedUndeploymentEntity>
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let queuedUndeployment: QueuedUndeploymentEntity
    let queuedDeployment: QueuedDeploymentEntity
    let nextQueuedDeployments: QueuedDeploymentEntity[]
    let circle: CircleDeploymentEntity
    let deployment: DeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let deploymentWithRelations: DeploymentEntity
    let moduleDeploymentWithRelations: ModuleDeploymentEntity
    let moduleDeploymentsList: ModuleDeploymentEntity[]
    let componentDeploymentsList: ComponentDeploymentEntity[]
    let undeploymentComponentDeployments: ComponentDeploymentEntity[]
    let undeploymentModuleDeployments: ModuleDeploymentEntity[]
    let undeploymentDeployment: DeploymentEntity
    let undeployment: UndeploymentEntity
    let queuedUndeployments: QueuedUndeploymentEntity[]
    let componentUndeploymentsRepository: ComponentUndeploymentsRepository
    let componentUndeployment: ComponentUndeploymentEntity
    let moduleUndeployment: ModuleUndeploymentEntity
    let componentsRepository: Repository<ComponentEntity>
    let componentEntity: ComponentEntity
    let moduleEntity: ModuleEntity

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                PipelineQueuesService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: 'QueuedUndeploymentEntityRepository', useClass: QueuedUndeploymentsRepositoryStub },
                { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
                { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'ModuleEntityRepository', useClass: ModulesRepositoryStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
                { provide: 'UndeploymentEntityRepository', useClass: UndeploymentsRepositoryStub },
                { provide: PipelineDeploymentsService, useClass: PipelineDeploymentsServiceStub }
            ]
        }).compile()

        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
        queuedUndeploymentsRepository = module.get<Repository<QueuedUndeploymentEntity>>('QueuedUndeploymentEntityRepository')
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        mooveService = module.get<MooveService>(MooveService)
        componentUndeploymentsRepository = module.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)
        componentsRepository = module.get<Repository<ComponentEntity>>('ComponentEntityRepository')

        queuedUndeployment = new QueuedUndeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING,
            'dummy-component-undeployment-id'
        )

        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING,
        )

        nextQueuedDeployments = [
            new QueuedDeploymentEntity(
                'dummy-component-id',
                'dummy-component-deployment-id',
                QueuedPipelineStatusEnum.QUEUED,
            ),
            new QueuedDeploymentEntity(
                'dummy-component-id',
                'dummy-component-deployment-id2',
                QueuedPipelineStatusEnum.QUEUED,
            ),
            new QueuedDeploymentEntity(
                'dummy-component-id',
                'dummy-component-deployment-id3',
                QueuedPipelineStatusEnum.QUEUED,
            )
        ]

        nextQueuedDeployments[0].id = 110
        nextQueuedDeployments[1].id = 111
        nextQueuedDeployments[2].id = 112

        circle = new CircleDeploymentEntity('dummy-circle')

        deployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-application-name',
            null,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            circle,
            false,
            'dummy-circle-id'
        )

        moduleDeployment = new ModuleDeploymentEntity(
            'dummy-id',
            'helm-repository',
            null
        )
        moduleDeployment.deployment = deployment

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag'
        )
        componentDeployment.moduleDeployment = moduleDeployment

        componentDeploymentsList = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag'
            )
        ]

        moduleDeploymentWithRelations = new ModuleDeploymentEntity(
            'dummy-id',
            'helm-repository',
            componentDeploymentsList
        )

        moduleDeploymentsList = [
            moduleDeploymentWithRelations
        ]

        deploymentWithRelations = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-valueflow-id',
            moduleDeploymentsList,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            circle,
            false,
            'dummy-circle-id'
        )

        undeploymentComponentDeployments = [
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name',
                'dummy-img-url',
                'dummy-img-tag'
            ),
            new ComponentDeploymentEntity(
                'dummy-id',
                'dummy-name2',
                'dummy-img-url2',
                'dummy-img-tag2'
            )
        ]

        undeploymentModuleDeployments = [
            new ModuleDeploymentEntity(
                'dummy-id',
                'helm-repository',
                undeploymentComponentDeployments
            )
        ]

        undeploymentDeployment = new DeploymentEntity(
            'dummy-deployment-id',
            'dummy-application-name',
            undeploymentModuleDeployments,
            'dummy-author-id',
            'dummy-description',
            'dummy-callback-url',
            null,
            false,
            'dummy-circle-id'
        )

        undeployment = new UndeploymentEntity(
            'dummy-author-id',
            undeploymentDeployment,
            'dummy-circle-id'
        )

        queuedUndeployments = [
            new QueuedUndeploymentEntity(
                'dummy-id',
                undeploymentComponentDeployments[0].id,
                QueuedPipelineStatusEnum.QUEUED,
                'dummy-id-2'
            ),
            new QueuedUndeploymentEntity(
                'dummy-id',
                undeploymentComponentDeployments[1].id,
                QueuedPipelineStatusEnum.QUEUED,
                'dummy-id-3'
            )
        ]
        queuedUndeployments[0].id = 200
        queuedUndeployments[1].id = 201

        componentUndeployment = new ComponentUndeploymentEntity(
            undeploymentComponentDeployments[0]
        )

        moduleUndeployment = new ModuleUndeploymentEntity(
            undeploymentModuleDeployments[0],
            [componentUndeployment]
        )
        moduleUndeployment.undeployment = undeployment

        componentUndeployment.moduleUndeployment = moduleUndeployment

        moduleEntity = new ModuleEntity(
            'module-id',
            null,
            []
        )

        componentEntity = new ComponentEntity(
            'component-id'
        )
    })

    describe('triggerNextComponentPipeline', () => {

        it('should update next queued pipeline status to RUNNING', async () => {
            jest.spyOn(queuedDeploymentsRepository, 'getOneByComponentIdRunning')
                .mockImplementation(() => Promise.resolve(undefined))
            jest.spyOn(queuedDeploymentsRepository, 'getNextQueuedDeployment')
                .mockImplementation(() => Promise.resolve(nextQueuedDeployments[0]))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            jest.spyOn(componentsRepository, 'findOne')
                .mockImplementationOnce(() => Promise.resolve(componentEntity))

            const queueSpy = jest.spyOn(queuedDeploymentsRepository, 'update')

            await pipelineQueuesService.triggerNextComponentPipeline(
                componentDeployment
            )

            expect(queueSpy)
                .toHaveBeenCalledWith({ id: nextQueuedDeployments[0].id }, { status: QueuedPipelineStatusEnum.RUNNING })
        })

        it('should not run queued pipeline if have another already running', async () => {

            jest.spyOn(queuedDeploymentsRepository, 'getNextQueuedDeployment')
                .mockImplementation(() => Promise.resolve(nextQueuedDeployments[0]))
            jest.spyOn(queuedDeploymentsRepository, 'getOneByComponentIdRunning')
                .mockImplementation(() => Promise.resolve(queuedUndeployment))
            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            jest.spyOn(componentsRepository, 'findOne')
                .mockImplementationOnce(() => Promise.resolve(componentEntity))

            const queueSpy = jest.spyOn(queuedDeploymentsRepository, 'update')

            await pipelineQueuesService.triggerNextComponentPipeline(
                componentDeployment
            )

            expect(queueSpy).not
                .toHaveBeenCalledWith({ id: nextQueuedDeployments[0].id }, { status: QueuedPipelineStatusEnum.RUNNING })
        })
    })
})
