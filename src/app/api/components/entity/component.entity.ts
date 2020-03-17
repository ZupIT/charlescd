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
  IPipelineOptions,
  IDeploymentVersion
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
  public module: ModuleEntity

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

  public toReadDto(): ReadComponentDto {
    return new ReadComponentDto(
      this.id,
      this.pipelineOptions,
      this.createdAt
    )
  }

  public setPipelineDefaultCircle(componentDeployment: ComponentDeploymentEntity): void {
    try {
      this.removeCurrentDefaultCircle()
      this.addDefaultCircle(componentDeployment)
      this.setUnusedVersions()
      this.addVersion(componentDeployment)
    } catch (error) {
      throw error
    }
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

  public unsetPipelineCircle(circle: CircleDeploymentEntity): void {
    try {
      this.removeCurrentCircleRule(circle)
      this.setUnusedVersions()
    } catch (error) {
      throw error
    }
  }

  public removePipelineCircle(circle: CircleDeploymentEntity): void {
    try {
      this.removeCurrentCircleRule(circle)
    } catch (error) {
      throw error
    }
  }

  private removeCurrentCircleRule(circle: CircleDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles = this.pipelineOptions.pipelineCircles.filter(
        pipelineCircle => !pipelineCircle.header || pipelineCircle.header.headerValue !== circle.headerValue
    )
  }

  private removeCurrentDefaultCircle(): void {
    this.pipelineOptions.pipelineCircles = this.pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !!pipelineCircle.header
    })
  }

  private addDefaultCircle(componentDeployment: ComponentDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles.push({
      destination: {
        version: componentDeployment.buildImageTag
      }
    })
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
    const currentVersions: IDeploymentVersion[] = this.pipelineOptions.pipelineVersions.filter(pipelineVersion =>
        !!this.pipelineOptions.pipelineCircles.find(
            pipelineCircle => pipelineCircle.destination.version === pipelineVersion.version
        )
    )
    const unusedVersions: IDeploymentVersion[] =
        this.pipelineOptions.pipelineVersions.filter(pipelineVersion => !currentVersions.includes(pipelineVersion))

    this.pipelineOptions.pipelineVersions = currentVersions
    this.pipelineOptions.pipelineUnusedVersions = unusedVersions
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
