import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { ReadComponentDto } from '../dto'
import { ModuleEntity } from '../../modules/entity'
import {
  IPipelineCircle,
  IPipelineOptions
} from '../interfaces'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity
} from '../../deployments/entity'
import { AppConstants } from '../../../core/constants'

@Entity('components')
export class ComponentEntity extends BaseEntity {

  @PrimaryColumn({
    name: 'id',
    type: 'uuid'
  })
  public id: string

  @ManyToOne(
    type => ModuleEntity,
    moduleEntity => moduleEntity.components
  )
  @JoinColumn({ name: 'module_id' })
  public module: ModuleEntity[]

  @Column({
    type: 'jsonb',
    name: 'pipeline_options'
  })
  public pipelineOptions: IPipelineOptions

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    componentId: string
  ) {
    super()
    this.id = componentId
    this.pipelineOptions = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
  }

  public async updatePipelineOptions(pipelineOptions: IPipelineOptions): Promise<void> {
    this.pipelineOptions = pipelineOptions
  }

  public toReadDto(): ReadComponentDto {
    return new ReadComponentDto(
      this.id,
      this.pipelineOptions,
      this.createdAt
    )
  }

  public setPipelineCircle(circle: CircleDeploymentEntity, componentDeployment: ComponentDeploymentEntity): void {
    try {
      this.removeCurrentCircleRule(circle)
      this.addCircleRule(circle, componentDeployment)
      this.setUnusedVersions()
      this.addVersion(componentDeployment)
    } catch (error) {
      throw error
    }
  }

  private removeCurrentCircleRule(circle: CircleDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles.filter(
        pipelineCircle => !pipelineCircle.header || pipelineCircle.header.headerValue !== circle.headerValue
    )
  }

  private addCircleRule(circle: CircleDeploymentEntity, componentDeployment: ComponentDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles.unshift({
      header: {
        headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME,
        headerValue: circle.headerValue
      },
      destination: {
        version: componentDeployment.buildImageTag
      }
    })
  }

  private setUnusedVersions(): void {
    this.pipelineOptions.pipelineVersions = this.pipelineOptions.pipelineVersions.filter(pipelineVersion =>
        !!this.pipelineOptions.pipelineCircles.find(
            pipelineCircle => pipelineCircle.destination.version === pipelineVersion.version
        )
    )
    this.pipelineOptions.pipelineUnusedVersions = this.pipelineOptions.pipelineVersions.filter(pipelineVersion =>
        !this.pipelineOptions.pipelineVersions.includes(pipelineVersion)
    )
  }

  private addVersion(componentDeployment: ComponentDeploymentEntity): void {
    this.pipelineOptions.pipelineVersions = this.pipelineOptions.pipelineVersions.filter(
        pipelineVersion => pipelineVersion.version !== componentDeployment.buildImageTag
    )
    this.pipelineOptions.pipelineVersions.push({
      versionUrl: componentDeployment.buildImageUrl,
      version: componentDeployment.buildImageTag
    })
  }
}
