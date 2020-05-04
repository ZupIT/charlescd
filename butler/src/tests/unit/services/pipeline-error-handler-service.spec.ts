import { Test } from '@nestjs/testing'
import {
    PipelineErrorHandlerService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import {
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModuleDeploymentsRepositoryStub,
    QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelineQueuesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    CircleDeploymentEntity,
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity,
    QueuedDeploymentEntity,
    UndeploymentEntity
} from '../../../app/api/deployments/entity'

import { Repository } from 'typeorm'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { MooveService } from '../../../app/core/integrations/moove'
import { QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import { ComponentEntity } from '../../../app/api/components/entity'
import {
    DeploymentStatusEnum,
    QueuedPipelineStatusEnum,
    UndeploymentStatusEnum
} from '../../../app/api/deployments/enums'
import { ModuleEntity } from '../../../app/api/modules/entity'
import { IPipelineOptions } from '../../../app/api/components/interfaces'

describe('Pipeline Error Handler Service specs', () => {

    let pipelineErrorHandlerService: PipelineErrorHandlerService
    let pipelineQueuesService: PipelineQueuesService
    let deploymentsRepository: Repository<DeploymentEntity>
    let moduleDeploymentsRepository: Repository<ModuleDeploymentEntity>
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let deployment: DeploymentEntity
    let undeploymentDeployment: DeploymentEntity
    let undeployment: UndeploymentEntity
    let undeploymentFailed: UndeploymentEntity
    let deploymentFailed: DeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let moduleDeployments: ModuleDeploymentEntity[]
    let componentEntity: ComponentEntity
    let componentEntityUpdated: ComponentEntity
    let moduleEntity: ModuleEntity
    let queuedDeploymentsRepository: QueuedDeploymentsRepository
    let componentsRepository: Repository<ComponentEntity>
    let queuedDeployment: QueuedDeploymentEntity
    let circle: CircleDeploymentEntity
    let pipelineOptions: IPipelineOptions
    let pipelineOptionsUpdated: IPipelineOptions

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                PipelineErrorHandlerService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: 'ModuleDeploymentsRepository', useClass: ModuleDeploymentsRepositoryStub },
                { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
            ]
        }).compile()

        pipelineErrorHandlerService = module.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        moduleDeploymentsRepository = module.get<Repository<ModuleDeploymentEntity>>('ModuleDeploymentsRepository')
        componentsRepository = module.get<Repository<ComponentEntity>>('ComponentEntityRepository')
        queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        mooveService = module.get<MooveService>(MooveService)

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag'
        )

        moduleDeployment = new ModuleDeploymentEntity(
            'dummy-id',
            'dummy-id',
            [componentDeployment]
        )

        moduleDeployments = [moduleDeployment]

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
            undeploymentDeployment,
            'dummy-circle-id'
        )

        undeploymentFailed = new UndeploymentEntity(
            'dummy-author-id',
            undeploymentDeployment,
            'dummy-circle-id'
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
            'component-id'
        )

        componentEntityUpdated = new ComponentEntity(
            'component-id'
        )
        const pipelineCircle = {
            header :
                {
                    headerName: 'dummy-header',
                    headerValue: 'dummy-circle'
                },
            destination : {
                version : 'dummy-version'
            },
        }
        pipelineOptions = { pipelineCircles: [pipelineCircle], pipelineVersions: [], pipelineUnusedVersions: [] }
        pipelineOptionsUpdated = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
        componentEntity.pipelineOptions =  pipelineOptions
        componentEntityUpdated.pipelineOptions =  pipelineOptionsUpdated

        moduleEntity = new ModuleEntity(
            'module-id',
            'k8s-id',
            [componentEntity]
        )

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag'
        )

        queuedDeployment = new QueuedDeploymentEntity(
            'dummy-component-id',
            'dummy-component-deployment-id',
            QueuedPipelineStatusEnum.RUNNING
        )

    })

    describe('handleComponentDeploymentFailure', () => {

        it('should  remove circle when component deployment fails', async () => {
            jest.spyOn(componentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(componentEntity))
            await pipelineErrorHandlerService
                .handleComponentDeploymentFailure(componentDeployment, queuedDeployment, circle)
            expect(componentEntity).toEqual(componentEntityUpdated)
        })

        it('should throw a internal server exception when fails to save updated component in database', async () => {
            jest.spyOn(componentsRepository, 'findOneOrFail')
                .mockImplementation(() => Promise.resolve(componentEntity))
            jest.spyOn(componentEntity, 'removePipelineCircle')
                .mockImplementation(() => { throw Error()})
            await expect(
                 pipelineErrorHandlerService
                    .handleComponentDeploymentFailure(componentDeployment, queuedDeployment, circle)).rejects.toThrow()
        })
    })

    describe('handleComponentUnDeploymentFailure', () => {

        it('should  update status to finished for queued undeployment', async () => {
            jest.spyOn(componentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(componentEntity))
            const pipelineQueueSpy = jest.spyOn(pipelineQueuesService, 'triggerNextComponentPipeline')
            await pipelineErrorHandlerService.handleComponentUndeploymentFailure(componentDeployment, queuedDeployment)
            expect(pipelineQueueSpy).toHaveBeenCalled()
        })
    })

    describe('handleDeploymentFailure', () => {

        it('should update status and notify moove', async () => {
            jest.spyOn(moduleDeploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve(moduleDeployments))
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))

            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleDeploymentFailure(deployment)
            expect(mooveServiceSpy).toHaveBeenCalled()
        })

        it('should  execute nothing when deployment has status failed', async () => {
            jest.spyOn(moduleDeploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve(moduleDeployments))
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleDeploymentFailure(deploymentFailed)
            expect(mooveServiceSpy).not.toHaveBeenCalled()
        })

        it('should execute nothing when there is no deployment', async () => {

            jest.spyOn(moduleDeploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve(moduleDeployments))
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleDeploymentFailure(undefined)
            expect(mooveServiceSpy).not.toHaveBeenCalled()
        })
    })

    describe('handleUndeploymentFailure', () => {

        it('should update status and notify moove', async () => {
            jest.spyOn(moduleDeploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve(moduleDeployments))
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleUndeploymentFailure(undeployment)
            expect(mooveServiceSpy).toHaveBeenCalled()

        })

        it('should not execute handle undeployment failure with status failed', async () => {
            jest.spyOn(moduleDeploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve(moduleDeployments))
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleUndeploymentFailure(undeploymentFailed)
            expect(mooveServiceSpy).not.toHaveBeenCalled()

        })

        it('should not execute handle undeployment failure with no deployment', async () => {
            jest.spyOn(moduleDeploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve(moduleDeployments))
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))
            const mooveServiceSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')
            await pipelineErrorHandlerService.handleUndeploymentFailure(undefined)
            expect(mooveServiceSpy).not.toHaveBeenCalled()

        })

    })
})
