import { Test } from '@nestjs/testing'
import { SpinnakerService } from '../../../app/core/integrations/spinnaker'
import { HttpService } from '@nestjs/common'
import {
    ConsoleLoggerServiceStub,
    DeploymentsStatusManagementServiceStub,
    HttpServiceStub
} from '../../stubs/services'
import { DeploymentsStatusManagementService } from '../../../app/core/services/deployments-status-management-service'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { AppConstants } from '../../../app/core/constants'
import { ConsulConfigurationStub } from '../../stubs/configurations'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import {
    CircleDeploymentEntity,
    ComponentDeploymentEntity
} from '../../../app/api/deployments/entity'

describe('SpinnakerService', () => {

    let spinnakerService: SpinnakerService
    let pipelineOptionsWithCircle: IPipelineOptions
    let pipelineOptionsWithoutCircle: IPipelineOptions
    let circlesToBeRemoved: CircleDeploymentEntity[]
    let circlesToBeAdded: CircleDeploymentEntity[]
    let componentDeployment: ComponentDeploymentEntity
    let defaultCircle: boolean

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                SpinnakerService,
                { provide: HttpService, useClass: HttpServiceStub },
                { provide: DeploymentsStatusManagementService, useClass: DeploymentsStatusManagementServiceStub },
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: AppConstants.CONSUL_PROVIDER, useValue: ConsulConfigurationStub }
            ]
        }).compile()

        spinnakerService = module.get<SpinnakerService>(SpinnakerService)

        pipelineOptionsWithCircle = {
            pipelineCircles: [
                {
                    header: { headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME, headerValue: 'dummy-circle'},
                    destination: { version: 'dummy-version' }
                }
            ],
            pipelineVersions: [{ versionUrl: 'dummy-url', version: 'dummy-version' }],
            pipelineUnusedVersions: []
        }

        pipelineOptionsWithoutCircle = {
            pipelineCircles: [],
            pipelineVersions: [],
            pipelineUnusedVersions: []
        }

        circlesToBeRemoved = [ new CircleDeploymentEntity('dummy-circle', true) ]
        circlesToBeAdded = [ new CircleDeploymentEntity('dummy-circle', false) ]

        componentDeployment = new ComponentDeploymentEntity(
            'dummy-id',
            'dummy-name',
            'dummy-url',
            'dummy-version',
            'dummy-path',
            'dummy-health-check',
            12345
        )

        defaultCircle = false
    })

    describe('updatePipelineOptions', () => {
        it('should correctly remove the last circle of the pipeline', async () => {
            await spinnakerService.updatePipelineOptions(pipelineOptionsWithCircle, circlesToBeRemoved, componentDeployment, defaultCircle)
            expect(pipelineOptionsWithCircle.pipelineCircles).toEqual([])
        })

        it('should correctly add the first circle of the pipeline', async () => {
            await spinnakerService.updatePipelineOptions(pipelineOptionsWithoutCircle, circlesToBeAdded, componentDeployment, defaultCircle)
            expect(pipelineOptionsWithoutCircle.pipelineCircles).toEqual(
                [
                    {
                        header: { headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME, headerValue: 'dummy-circle' },
                        destination: { version: 'dummy-version' }
                    }
                ]
            )
        })
    })
})
