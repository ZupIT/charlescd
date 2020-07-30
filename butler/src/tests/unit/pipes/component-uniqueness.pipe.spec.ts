import { ComponentsRepositoryStub, DeploymentsRepositoryStub } from '../../stubs/repository'
import { ComponentUniquenessPipe } from '../../../app/v1/api/deployments/pipes/component-uniqueness.pipe'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../../app/v1/api/deployments/entity'
import { DeploymentsRepository } from '../../../app/v1/api/deployments/repository/deployments.repository'
import { ComponentRepository } from '../../../app/v1/api/deployments/repository/components.repository'
import { ComponentEntity } from '../../../app/v1/api/components/entity'
import { IPipelineOptions } from '../../../app/v1/api/components/interfaces'
import { ConflictException } from '@nestjs/common'


describe('Component Uniqueness pipe', () => {
  it('should throw error if deployment exists', async() => {

    const deploymentsRepository = new DeploymentsRepositoryStub() as unknown as DeploymentsRepository
    const componentsRepository = new ComponentsRepositoryStub() as unknown as ComponentRepository
    const componentUniquenessPipe = new ComponentUniquenessPipe(deploymentsRepository, componentsRepository)

    const componentEntity = new ComponentEntity(
      'component-id',
      undefined,
      undefined
    )
    const pipelineOptions: IPipelineOptions = {
      pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
      pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
      pipelineUnusedVersions: [{ version: 'v2', versionUrl: 'version.url/tag:456' }]
    }
    const componentDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component-name',
      'build-image-url',
      'build-image-tag'
    )

    const moduleDeploymentEntity = new ModuleDeploymentEntity(
      'module-id',
      'helm-repository',
      [componentDeploymentEntity]
    )
    componentEntity.pipelineOptions = pipelineOptions

    const deploymentRequest = new DeploymentEntity(
      'some-id-2',
      'app-name',
      [moduleDeploymentEntity],
      'author',
      'https://callbacl.com',
      '123123',
      null,
      false,
      '',
      'cd-id'
    )

    const deploymentEntity = new DeploymentEntity(
      'some-id',
      'app-name',
      [moduleDeploymentEntity],
      'author',
      'https://callbacl.com',
      '123123',
      null,
      false,
      '',
      'cd-id'
    )
    moduleDeploymentEntity.deployment = deploymentRequest
    jest.spyOn(componentsRepository,'findOne').mockImplementation(
      () => Promise.resolve(componentEntity)
    )
    jest.spyOn(deploymentsRepository, 'findWithAllRelations')
      .mockImplementation(() => Promise.resolve(deploymentEntity))

    await expect(componentUniquenessPipe.transform(deploymentRequest)).rejects.toThrow(new ConflictException('Conflict Exception'))
  })

})
