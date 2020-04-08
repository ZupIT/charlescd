import { Test } from '@nestjs/testing'
import { ComponentsExistencePipe } from '../../../app/api/deployments/pipes'
import { ComponentsRepositoryStub } from '../../stubs/repository'
import { CreateDeploymentRequestDto, CreateModuleDeploymentDto, CreateComponentDeploymentDto } from '../../../app/api/deployments/dto'
import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { ComponentEntity } from '../../../app/api/components/entity'
import { Repository } from 'typeorm'
import { ModuleDeploymentEntity, ComponentDeploymentEntity } from '../../../app/api/deployments/entity'

describe('ComponentExistencePipe', () => {
  let componentRepository: Repository<ComponentEntity>
  let pipe: ComponentsExistencePipe
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ComponentsExistencePipe,
        { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub }
      ]
    }).compile()

    pipe = module.get<ComponentsExistencePipe>(ComponentsExistencePipe)
    componentRepository = module.get<Repository<ComponentEntity>>('ComponentEntityRepository')

  })

  it('throws when no component found', async () => {
    jest.spyOn(componentRepository, 'findOne').mockImplementation(() => undefined)
    const componentDeploymentEntity: ComponentDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component-name',
      'https://image.url',
      'image-tag'
    )
    const components: CreateComponentDeploymentDto = {
      ...componentDeploymentEntity,
      toEntity: () => componentDeploymentEntity
    }
    const modules: CreateModuleDeploymentDto[] = [
      {
        moduleId: 'module-id',
        helmRepository: 'helm-repo',
        components: [components],
        toEntity: () => new ModuleDeploymentEntity('module-id', 'helm-repo', [])
      }
    ]

    const params: CreateDeploymentRequestDto = {
      applicationName: 'app-name',
      authorId: 'author-id',
      callbackUrl: 'callback-url',
      deploymentId: 'deployment-id',
      description: 'description',
      modules
    }

    const metadata: ArgumentMetadata = {
      type: 'body'
    }

    await expect(pipe.transform(params, metadata)).rejects.toThrow(BadRequestException)
  })

  it('returns the params when components are found', async () => {
    const componentEntity = new ComponentEntity('component-id')

    jest.spyOn(componentRepository, 'findOne').mockImplementation(() => Promise.resolve(componentEntity))
    const componentDeploymentEntity: ComponentDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component-name',
      'https://image.url',
      'image-tag'
    )

    const components: CreateComponentDeploymentDto = {
      ...componentDeploymentEntity,
      toEntity: () => componentDeploymentEntity
    }

    const modules: CreateModuleDeploymentDto[] = [
      {
        moduleId: 'module-id',
        helmRepository: 'helm-repo',
        components: [components],
        toEntity: () => new ModuleDeploymentEntity('module-id', 'helm-repo', [])
      }
    ]

    const params: CreateDeploymentRequestDto = {
      applicationName: 'app-name',
      authorId: 'author-id',
      callbackUrl: 'callback-url',
      deploymentId: 'deployment-id',
      description: 'description',
      modules
    }
    const metadata: ArgumentMetadata = {
      type: 'body'
    }

    expect(await pipe.transform(params, metadata)).toEqual(params)

  })
})
