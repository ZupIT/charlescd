import { Test } from '@nestjs/testing'
import {
    DeploymentsService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import { DeploymentsRepositoryStub } from '../../stubs/repository'
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
    ModuleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import {
    CreateCircleDeploymentDto,
    CreateDeploymentDto
} from '../../../app/api/deployments/dto'
import { BadRequestException } from '@nestjs/common'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { DeploymentStatusEnum } from '../../../app/api/deployments/enums'
import { MooveService } from '../../../app/core/integrations/moove'
import { NotificationStatusEnum } from '../../../app/api/notifications/enums'

describe('Deployments service specs', () => {
    let deploymentsService: DeploymentsService
    let pipelineQueuesService: PipelineQueuesService
    let deploymentsRepository: Repository<DeploymentEntity>
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let createCircleDeploymentDto: CreateCircleDeploymentDto
    let createDeploymentDto: CreateDeploymentDto
    let circle: CircleDeploymentEntity
    let deployment: DeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                DeploymentsService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
            ]
        }).compile()

        deploymentsService = module.get<DeploymentsService>(DeploymentsService)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
        pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
        statusManagementService = module.get<StatusManagementService>(StatusManagementService)
        mooveService = module.get<MooveService>(MooveService)

        createCircleDeploymentDto = new CreateCircleDeploymentDto(
            'header-value',
            false
        )

        createDeploymentDto = new CreateDeploymentDto(
            'deployment-id',
            'application-name',
            [],
            'author-id',
            'description',
            'callback-url',
            false,
            createCircleDeploymentDto
        )

        circle = new CircleDeploymentEntity('header-value', false)

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
            [componentDeployment]
        )

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
    })

    describe('createDeployment', () => {

        it('should correctly handle deployments that already exist', async () => {
            const saveSpy = jest.spyOn(deploymentsRepository, 'save')
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(deployment))

            await expect(deploymentsService.createDeployment(createDeploymentDto, 'incoming-circle-id'))
                .rejects.toThrowError(BadRequestException)

            expect(saveSpy).toHaveBeenCalledTimes(0)
        })

        it('should correctly set deployment status as failed when exception occurred', async () => {
            jest.spyOn(deploymentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(undefined))
            jest.spyOn(deploymentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(deployment))
            jest.spyOn(pipelineQueuesService, 'queueDeploymentTasks')
                .mockImplementation(() => { throw new Error() })
            const statusSpy = jest.spyOn(statusManagementService, 'deepUpdateDeploymentStatus')
            const applicationSpy = jest.spyOn(mooveService, 'notifyDeploymentStatus')

            await expect(deploymentsService.createDeployment(createDeploymentDto, 'incoming-circle-id'))
                .rejects.toThrowError(Error)
            expect(statusSpy)
                .toHaveBeenCalledWith(deployment, DeploymentStatusEnum.FAILED)
            expect(applicationSpy)
                .toHaveBeenCalledWith(deployment.id, NotificationStatusEnum.FAILED, deployment.callbackUrl, deployment.circleId)
        })
    })
})
