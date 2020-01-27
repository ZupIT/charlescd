import { Test } from '@nestjs/testing'
import { PipelinesService } from '../../../app/api/deployments/services'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ConsoleLoggerServiceStub,
    DeploymentConfigurationServiceStub,
    SpinnakerServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import { SpinnakerService } from '../../../app/core/integrations/spinnaker'
import {
    ComponentDeploymentsRepositoryStub,
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub
} from '../../stubs/repository'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { ComponentDeploymentsRepository } from '../../../app/api/deployments/repository'
import { DeploymentConfigurationService } from '../../../app/core/integrations/configuration'
import { AppConstants } from '../../../app/core/constants'
import { ConsulConfigurationStub } from '../../stubs/configurations'
import {
    CircleDeploymentEntity,
    ComponentDeploymentEntity,
    DeploymentEntity,
    ModuleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { ComponentEntity } from '../../../app/api/components/entity'
import { Repository } from 'typeorm'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { IDeploymentConfiguration } from '../../../app/core/integrations/configuration/interfaces'
import { ModuleEntity } from '../../../app/api/modules/entity'

describe('PipelinesService', () => {

    let pipelinesService: PipelinesService
    let componentDeploymentsRepository: ComponentDeploymentsRepository
    let componentsRepository: Repository<ComponentEntity>
    let modulesRepository: Repository<ModuleEntity>
    let deploymentConfigurationService: DeploymentConfigurationService
    let deployment: DeploymentEntity
    let moduleDeployment: ModuleDeploymentEntity
    let componentDeployment: ComponentDeploymentEntity
    let component: ComponentEntity
    let moduleEntity: ModuleEntity
    let pipelineOptionsWithCircle: IPipelineOptions
    let pipelineOptionsWithoutCircle: IPipelineOptions
    let circle: CircleDeploymentEntity
    let deploymentConfiguration: IDeploymentConfiguration

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                PipelinesService,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: SpinnakerService, useClass: SpinnakerServiceStub },
                { provide: 'ModuleEntityRepository', useClass:  ModulesRepositoryStub},
                { provide: ComponentDeploymentsRepository, useClass:  ComponentDeploymentsRepositoryStub},
                { provide: 'ComponentEntityRepository', useClass:  ComponentsRepositoryStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: DeploymentConfigurationService, useClass: DeploymentConfigurationServiceStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
                { provide: AppConstants.CONSUL_PROVIDER, useValue: ConsulConfigurationStub }
            ]
        }).compile()

        pipelinesService = module.get<PipelinesService>(PipelinesService)
        componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
        componentsRepository = module.get<Repository<ComponentEntity>>('ComponentEntityRepository')
        modulesRepository = module.get<Repository<ModuleEntity>>('ModuleEntityRepository')
        deploymentConfigurationService = module.get<DeploymentConfigurationService>(DeploymentConfigurationService)

        pipelineOptionsWithCircle = {
            pipelineCircles: [
                {
                    header: { headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME, headerValue: 'dummy-circle'},
                    destination: { version: 'dummy-img-tag' }
                }
            ],
            pipelineVersions: [{ versionUrl: 'dummy-url', version: 'dummy-img-tag' }],
            pipelineUnusedVersions: []
        }

        pipelineOptionsWithoutCircle = {
            pipelineCircles: [],
            pipelineVersions: [],
            pipelineUnusedVersions: []
        }

        circle = new CircleDeploymentEntity('dummy-circle', false)

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
            'dummy-id',
            null
        )
        moduleDeployment.deployment = deployment

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-img-url',
            'dummy-img-tag',
            'dummy-context-path',
            'dummy-health-check',
            1234
        )
        componentDeployment.moduleDeployment = moduleDeployment

        component = new ComponentEntity(
            'dummy-id',
            null
        )

        deploymentConfiguration = {
            account: 'dummy-account',
            pipelineName: 'dummy-pipeline-name',
            applicationName: 'dummy-application-name',
            appName: 'dummy-app-name',
            appNamespace: 'dummy-app-namespace',
            healthCheckPath: 'dummy-health-check-path',
            uri: {
                uriName: 'dummy-uri-name'
            },
            appPort: 12345
        }

        moduleEntity = new ModuleEntity(
            'dummy-id',
            [ component ]
        )
    })

    describe('triggerUndeployment', () => {
        it('should correctly remove circle and version from pipeline', async () => {

            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            jest.spyOn(componentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(component))
            jest.spyOn(componentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(component))
            jest.spyOn(deploymentConfigurationService, 'getConfiguration')
                .mockImplementation(() => Promise.resolve(deploymentConfiguration))

            component.pipelineOptions = pipelineOptionsWithCircle

            await pipelinesService.triggerUndeployment(
                'dummy-component-deployment-id',
                123
            )

            expect(component.pipelineOptions.pipelineCircles).toEqual([])
            expect(component.pipelineOptions.pipelineVersions).toEqual([])
            expect(component.pipelineOptions.pipelineUnusedVersions).toEqual([ { versionUrl: 'dummy-url', version: 'dummy-img-tag' } ])
        })

        it('should incorrectly remove circle and version from pipeline', async () => {
            const responseError = new Error('message error')

            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.reject(responseError))
            jest.spyOn(componentsRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(component))
            jest.spyOn(componentsRepository, 'save')
                .mockImplementation(() => Promise.resolve(component))
            jest.spyOn(deploymentConfigurationService, 'getConfiguration')
                .mockImplementation(() => Promise.resolve(deploymentConfiguration))

            component.pipelineOptions = pipelineOptionsWithCircle

            await expect(pipelinesService.triggerUndeployment(
              'dummy-component-deployment-id',
              123
            )).rejects.toBeTruthy()
        })
    })

    describe('triggerDeployment', () => {
        it('should correctly add circle and version to pipeline', async () => {

            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.resolve(componentDeployment))
            jest.spyOn(modulesRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(moduleEntity))
            jest.spyOn(modulesRepository, 'save')
                .mockImplementation(() => Promise.resolve(moduleEntity))

            component.pipelineOptions = pipelineOptionsWithoutCircle

            await pipelinesService.triggerDeployment(
                'dummy-component-deployment-id',
                false,
                123
            )

            expect(component.pipelineOptions.pipelineCircles).toEqual([{
                header: { headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME, headerValue: 'dummy-circle'},
                destination: { version: 'dummy-img-tag' }
            }])
            expect(component.pipelineOptions.pipelineVersions).toEqual([ { versionUrl: 'dummy-img-url', version: 'dummy-img-tag' } ])
            expect(component.pipelineOptions.pipelineUnusedVersions).toEqual([])
        })

        it('should incorrectly add circle and version to pipeline', async () => {
            const responseError = new Error('message error')

            jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
                .mockImplementation(() => Promise.reject(responseError))
            jest.spyOn(modulesRepository, 'findOne')
                .mockImplementation(() => Promise.resolve(moduleEntity))
            jest.spyOn(modulesRepository, 'save')
                .mockImplementation(() => Promise.resolve(moduleEntity))

            component.pipelineOptions = pipelineOptionsWithoutCircle

            await expect(pipelinesService.triggerDeployment(
                'dummy-component-deployment-id',
                false,
                123,
            )).rejects.toBeTruthy()
        })
    })

})
