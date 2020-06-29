/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Test } from '@nestjs/testing'
import { of } from 'rxjs'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { OctopipeConfigurationData } from '../../../app/api/configurations/interfaces'
import { ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity } from '../../../app/api/deployments/entity'
import { IoCTokensConstants } from '../../../app/core/constants/ioc'
import { IConnectorConfiguration } from '../../../app/core/integrations/cd/interfaces'
import { OctopipeService } from '../../../app/core/integrations/cd/octopipe'
import { OctopipeApiService } from '../../../app/core/integrations/cd/octopipe/octopipe-api.service'
import { GitProvidersEnum } from '../../../app/core/integrations/configuration/interfaces'
import { IOctopipePayload, ClusterProviderEnum } from '../../../app/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { EnvConfigurationStub } from '../../stubs/configurations'
import { ConsoleLoggerServiceStub, OctopipeApiServiceStub } from '../../stubs/services'
import { CallbackTypeEnum } from '../../../app/api/notifications/enums/callback-type.enum'

describe('Octopipe Service', () => {
  let octopipeService: OctopipeService
  let octopipeApiService: OctopipeApiService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OctopipeService,
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: IoCTokensConstants.ENV_CONFIGURATION, useValue: EnvConfigurationStub },
        { provide: OctopipeApiService, useClass: OctopipeApiServiceStub }
      ]
    }).compile()

    octopipeService = module.get<OctopipeService>(OctopipeService)
    octopipeApiService = module.get<OctopipeApiService>(OctopipeApiService)
  })

  describe('octopipeService', () => {

    it('should create the right payload for EKS config', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2'
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id',
          'cd-configuration-id'
      )

      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment

      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.EKS,
        awsClusterName: 'cluster-name',
        awsRegion: 'region',
        awsSID: 'sid',
        awsSecret: 'secret',
        gitProvider: GitProvidersEnum.GITHUB,
        gitToken: 'some-github-token',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }

      const payload = octopipeService.createPipelineConfigurationObject(connectorConfiguration)

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProvidersEnum.GITHUB,
          token: 'some-github-token',
        },
        k8s: {
          provider: ClusterProviderEnum.EKS,
          awsClusterName: 'cluster-name',
          awsRegion: 'region',
          awsSID: 'sid',
          awsSecret: 'secret',
        },
        helmUrl: 'helm-repository',
        istio: {
          virtualService: {

          },
          destinationRules: {

          }
        },
        unusedVersions: [],
        versions: [
          {
            version: 'some-app-name-v1',
            versionUrl: 'version.url/tag:123'
          }
        ],
        webHookUrl: 'dummy-callback-url',
        circleId: 'circle-id',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('should create the right payload for GENERIC config', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2'
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id',
          'cd-configuration-id'
      )

      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment

      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.GENERIC,
        clientCertificate: 'client-cert',
        clientKey: 'client-key',
        gitProvider: GitProvidersEnum.GITHUB,
        caData: 'ca-data',
        gitToken: 'some-github-token',
        host: 'https://k8s.com',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }

      const payload = octopipeService.createPipelineConfigurationObject(connectorConfiguration)

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProvidersEnum.GITHUB,
          token: 'some-github-token',
        },
        k8s: {
          provider: ClusterProviderEnum.GENERIC,
          clientCertificate: 'client-cert',
          caData: 'ca-data',
          clientKey: 'client-key',
          host: 'https://k8s.com',
        },
        helmUrl: 'helm-repository',
        istio: {
          virtualService: {

          },
          destinationRules: {

          }
        },
        unusedVersions: [],
        versions: [
          {
            version: 'some-app-name-v1',
            versionUrl: 'version.url/tag:123'
          }
        ],
        webHookUrl: 'dummy-callback-url',
        circleId: 'circle-id',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('should create the right payload for DEFAULT config', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2'
      )
      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )
      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id',
          'cd-configuration-id'
      )

      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment

      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
        pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
        pipelineUnusedVersions: []
      }

      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.DEFAULT,
        gitProvider: GitProvidersEnum.GITHUB,
        gitToken: 'some-github-token',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }

      const payload = octopipeService.createPipelineConfigurationObject(connectorConfiguration)

      const expectedPayload: IOctopipePayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        git: {
          provider: GitProvidersEnum.GITHUB,
          token: 'some-github-token',
        },
        helmUrl: 'helm-repository',
        istio: {
          virtualService: {},
          destinationRules: {}
        },
        unusedVersions: [],
        versions: [
          {
            version: 'some-app-name-v1',
            versionUrl: 'version.url/tag:123'
          }
        ],
        webHookUrl: 'dummy-callback-url',
        circleId: 'circle-id',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }
      expect(payload).toEqual(expectedPayload)
    })

    it('should create a empty virtual service', () => {
      const componentDeployment = new ComponentDeploymentEntity(
        'dummy-id',
        'some-app-name',
        'dummy-img-url2',
        'dummy-img-tag2',
      )

      const moduleDeployment = new ModuleDeploymentEntity(
        'dummy-id',
        'helm-repository',
        [componentDeployment]
      )

      const deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        [moduleDeployment],
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id',
          'cd-configuration-id'
      )
      moduleDeployment.deployment = deployment
      componentDeployment.moduleDeployment = moduleDeployment
      const pipelineOptions: IPipelineOptions = {
        pipelineCircles: [],
        pipelineVersions: [],
        pipelineUnusedVersions: []
      }
      const octopipeConfiguration: OctopipeConfigurationData = {
        provider: ClusterProviderEnum.EKS,
        awsClusterName: 'cluster-name',
        awsRegion: 'region',
        awsSID: 'sid',
        awsSecret: 'secret',
        gitProvider: GitProvidersEnum.GITHUB,
        gitToken: 'some-github-token',
        namespace: 'some-app-namespace'
      }

      const connectorConfiguration: IConnectorConfiguration = {
        pipelineCirclesOptions: pipelineOptions,
        cdConfiguration: octopipeConfiguration,
        componentId: componentDeployment.componentId,
        applicationName: componentDeployment.moduleDeployment.deployment.applicationName,
        componentName: componentDeployment.componentName,
        helmRepository: componentDeployment.moduleDeployment.helmRepository,
        callbackCircleId: 'circle-id',
        pipelineCallbackUrl: 'dummy-callback-url',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }

      const payload =
        octopipeService.createPipelineConfigurationObject(
          connectorConfiguration
        )

      const expectedPayload = {
        appName: 'some-app-name',
        appNamespace: 'some-app-namespace',
        circleId: 'circle-id',
        git: {
          provider: 'GITHUB',
          token: 'some-github-token'
        },
        helmUrl: 'helm-repository',
        istio: {
          virtualService: {
          },
          destinationRules: {
          },
        },
        k8s: {
          awsClusterName: 'cluster-name',
          awsRegion: 'region',
          awsSID: 'sid',
          awsSecret: 'secret',
          provider: 'EKS',
        },
        unusedVersions: [],
        versions: [],
        webHookUrl: 'dummy-callback-url',
        callbackType: CallbackTypeEnum.DEPLOYMENT
      }
      expect(payload).toEqual(expectedPayload)
    })
    it('posts to octopipe server', async () => {
      const payload = {} as IOctopipePayload
      jest.spyOn(octopipeApiService, 'deploy').mockImplementation(
        () => of({
          data: {
            id: 'some-pipeline-id'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        })
      )
      expect(
        await octopipeService.deploy(payload)
      ).toEqual({ config: {}, data: { id: 'some-pipeline-id' }, headers: {}, status: 200, statusText: 'OK' })
    })

    it('should handle on octopipe deployment failure', async () => {
      const payload = {} as IOctopipePayload
      jest.spyOn(octopipeApiService, 'deploy').mockImplementation(
        () => { throw new Error('bad request') }
      )
      await expect(octopipeService.deploy(payload)).rejects.toThrow()
    })
  })
})
