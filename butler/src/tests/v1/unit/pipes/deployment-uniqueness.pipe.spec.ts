import 'jest'
import { DeploymentUniquenessPipe } from '../../../../app/v1/api/deployments/pipes'
import { Repository } from 'typeorm'
import { DeploymentEntity, ComponentDeploymentEntity, ModuleDeploymentEntity, CircleDeploymentEntity } from '../../../../app/v1/api/deployments/entity'
import { CreateDeploymentRequestDto } from '../../../../app/v1/api/deployments/dto'

describe('uniqueness pipe', () => {
  it('should return the same request passed', async() => {
    const entityRepository = new Repository<DeploymentEntity>()
    const pipe = new DeploymentUniquenessPipe(entityRepository)
    const deploymentParams = {
      deploymentId: 'some-id',
      applicationName: 'app-name',
      authorId: 'author',
      callbackUrl: 'https://callbacl.com',
      cdConfigurationId: '123123',
      description: 'my deployment',
      modules: []
    }
    const request : CreateDeploymentRequestDto = {
      ...deploymentParams,
      circle: { headerValue: 'some-header-value', toEntity: () => { return new CircleDeploymentEntity('some-header-value') } },
      toEntity: () => {
        return new DeploymentEntity(
          deploymentParams.deploymentId, deploymentParams.applicationName,
          deploymentParams.modules, deploymentParams.authorId,
          deploymentParams.description, deploymentParams.callbackUrl,
          null, true,
          'circle-id', deploymentParams.cdConfigurationId)
      }
    }
    jest.spyOn(entityRepository, 'findOne').mockImplementation(() => Promise.resolve(undefined))
    const pipeTransformation = await pipe.transform(request)
    expect(pipeTransformation).toEqual(request)
  })
  it('should return the same request passed', () => {
    const entityRepository = new Repository<DeploymentEntity>()
    const pipe = new DeploymentUniquenessPipe(entityRepository)
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

    const deploymentParams = {
      deploymentId: 'some-id',
      applicationName: 'app-name',
      authorId: 'author',
      callbackUrl: 'https://callbacl.com',
      cdConfigurationId: '123123',
      description: 'my deployment',
      modules: []
    }
    const request : CreateDeploymentRequestDto = {
      ...deploymentParams,
      circle: { headerValue: 'some-header-value', toEntity: () => { return new CircleDeploymentEntity('some-header-value') } },
      toEntity: () => {
        return new DeploymentEntity(
          deploymentParams.deploymentId, deploymentParams.applicationName,
          deploymentParams.modules, deploymentParams.authorId,
          deploymentParams.description, deploymentParams.callbackUrl,
          null, true,
          'circle-id', deploymentParams.cdConfigurationId)
      }
    }
    jest.spyOn(entityRepository, 'findOne').mockImplementation(() => Promise.resolve(deployment))
    expect(pipe.transform(request)).rejects.toThrow()
  })
})
