import { Test } from '@nestjs/testing'
import {
    DeploymentsService,
    PipelineQueuesService
} from '../../../app/api/deployments/services'
import { DeploymentsRepositoryStub } from '../../stubs/repository'
import {
    ConsoleLoggerServiceStub,
    PipelineQueuesServiceStub
} from '../../stubs/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    CircleDeploymentEntity,
    DeploymentEntity
} from '../../../app/api/deployments/entity'
import { Repository } from 'typeorm'
import {
    CreateCircleDeploymentDto,
    CreateDeploymentDto
} from '../../../app/api/deployments/dto'
import { BadRequestException } from '@nestjs/common'

describe('Deployments service specs', () => {
    let deploymentsService: DeploymentsService
    let deploymentsRepository: Repository<DeploymentEntity>
    let createCircleDeploymentDto: CreateCircleDeploymentDto
    let createDeploymentDto: CreateDeploymentDto
    let circle: CircleDeploymentEntity
    let deployment: DeploymentEntity

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                DeploymentsService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
            ]
        }).compile()

        deploymentsService = module.get<DeploymentsService>(DeploymentsService)
        deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')

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

        deployment = new DeploymentEntity(
            'deployment-id',
            'application-name',
            null,
            'author-id',
            'description',
            'callback-url',
            circle,
            false,
            'incoming-circle-id'
        )
    })

    it('should correctly handle deployments that already exist', async () => {
        const saveSpy = jest.spyOn(deploymentsRepository, 'save')
        jest.spyOn(deploymentsRepository, 'findOne')
            .mockImplementation(() => Promise.resolve(deployment))

        await expect(deploymentsService.createDeployment(createDeploymentDto, 'incoming-circle-id'))
            .rejects.toThrowError(BadRequestException)

        expect(saveSpy).toHaveBeenCalledTimes(0)
    })
})
