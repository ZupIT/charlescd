import { DeploymentsRepositoryStub } from '../../stubs/repository'
import { ComponentUniquenessPipe } from '../../../app/v1/api/deployments/pipes/component-uniqueness.pipe'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../../app/v1/api/deployments/entity'
import { DeploymentsRepository } from '../../../app/v1/api/deployments/repository/deployments.repository'

describe('Component Uniqueness pipe', () => {
  it('should throw error if deployment exists', async() => {

    const deploymentsRepository = new DeploymentsRepositoryStub() as unknown as DeploymentsRepository
    const componentUniquenessPipe = new ComponentUniquenessPipe(deploymentsRepository)
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
      [],
      'author',
      'https://callbacl.com',
      '123123',
      null,
      false,
      '',
      'cd-id'
    )
    jest.spyOn(deploymentsRepository, 'findWithAllRelations')
      .mockImplementation(() => Promise.resolve(deploymentEntity))

    await expect(componentUniquenessPipe.transform(deploymentRequest)).rejects.toThrow()
  })

})
