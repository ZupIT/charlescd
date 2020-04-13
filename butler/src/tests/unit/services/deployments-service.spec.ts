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
    CreateCircleDeploymentRequestDto
} from '../../../app/api/deployments/dto'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { MooveService } from '../../../app/core/integrations/moove'

describe('Deployments service specs', () => {
    let deploymentsService: DeploymentsService
    let pipelineQueuesService: PipelineQueuesService
    let deploymentsRepository: Repository<DeploymentEntity>
    let statusManagementService: StatusManagementService
    let mooveService: MooveService
    let createCircleDeploymentDto: CreateCircleDeploymentDto
    let createDeploymentDto: CreateCircleDeploymentRequestDto
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
            'header-value'
        )

        createDeploymentDto = new CreateCircleDeploymentRequestDto(
            'deployment-id',
            'application-name',
            [],
            'author-id',
            'description',
            'callback-url',
            createCircleDeploymentDto
        )

        circle = new CircleDeploymentEntity('header-value')

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
            'helm-repository',
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

    describe('getDeployments', () => {

        it('should correctly return deployments as dtos', async () => {

            jest.spyOn(deploymentsRepository, 'find')
                .mockImplementation(() => Promise.resolve([deployment]))

            expect(await deploymentsService.getDeployments()).toStrictEqual([deployment.toReadDto()])
        })
    })
})
