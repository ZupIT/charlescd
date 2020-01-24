import { Test } from '@nestjs/testing'
import { SpinnakerService } from '../../../app/core/integrations/spinnaker'
import { HttpServiceStub, StatusManagementServiceStub, ConsoleLoggerServiceStub } from '../../stubs/services'
import { HttpService } from '@nestjs/common'
import { ConsulConfigurationStub } from '../../stubs/configurations'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { AppConstants } from '../../../app/core/constants'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'

describe('Spinnaker Service', () => {
  let spinnakerService: SpinnakerService
  let httpService: HttpService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SpinnakerService,
        { provide: StatusManagementService, useClass: StatusManagementServiceStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: AppConstants.CONSUL_PROVIDER, useValue: ConsulConfigurationStub },
        { provide: HttpService, useClass: HttpServiceStub }
      ]
    }).compile()

    spinnakerService = module.get<SpinnakerService>(SpinnakerService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should call spinnaker api with application name and module name', async () => {
    const pipelineOptions = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
    const deploymentConfiguration = {
      account: 'some-account',
      pipelineName: 'some-pipeline-name',
      applicationName: 'some-application-name',
      appName: 'some-app-name',
      appNamespace: 'some-app-namespace',
      healthCheckPath: '/health',
      uri: { uriName: 'https://some.uri' },
      appPort: 8989
    }
    const componentId = 'some-component-id'
    const deploymentId = 'some-deployment-id'
    const circleId = 'some-circle-id'
    const callbackUrl = 'some-callback-url'

    const result: AxiosResponse = {
      data: {
        id: 'some-pipeline-id',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }

    jest.spyOn(httpService, 'get').mockImplementation(() => of(result))
    jest.spyOn(spinnakerService, 'waitForPipelineCreation').mockImplementation(() => Promise.resolve())
    const httpSpy = jest.spyOn(httpService, 'post').mockImplementation(() => of(result))
    await spinnakerService.createDeployment(pipelineOptions, deploymentConfiguration, componentId, deploymentId, circleId, callbackUrl)

    expect(httpSpy).nthCalledWith(2,
      'spinnakerurl.com/pipelines/some-application-name/some-pipeline-name', {}, { headers: { 'Content-Type': 'application/json' } })
  })
})
