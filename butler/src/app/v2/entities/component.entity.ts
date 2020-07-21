import { PrimaryColumn, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { DeploymentEntity } from './deployment.entity';

@Entity('v2components')
export class ComponentEntity {
  @PrimaryColumn('uuid')
  public id!: string

  @Column({ name: 'helm_url'})
  public helmUrl!: string

  @Column({ name: 'image_tag' })
  public imageTag!: string

  @Column({ name: 'image_url' })
  public imageUrl!: string

  @Column({ name: 'name' })
  public name!: string

  @Column({ name: 'running', default: false})
  public running!: boolean

  @JoinColumn({name: 'deployment_id'})
  @ManyToOne(() => DeploymentEntity, deployment => deployment.components)
  deployment!: DeploymentEntity

  constructor(helmUrl: string, buildImageTag: string, buildImageUrl: string, componentName: string) {
    this.helmUrl = helmUrl
    this.imageTag = buildImageTag
    this.imageUrl = buildImageUrl
    this.name = componentName
  }

  public fromDto(dto: ComponentCreateDTO) : ComponentEntity{
    return new ComponentEntity(dto.helmRepository, dto.buildImageTag, dto.buildImageUrl, dto.componentName)
  }

  public toDto() : ReadComponentDTO {
    return {
      id: this.id,
      helmUrl: this.helmUrl,
      imageTag: this.imageTag,
      imageUrl: this.imageUrl,
      name: this.name,
      running: this.running
    }
  }
}


interface ComponentCreateDTO {
  componentId: string
  componentName: string
  buildImageUrl: string
  buildImageTag: string
  helmRepository: string

}

interface ReadComponentDTO {
  id: string
  helmUrl: string
  imageTag: string
  imageUrl: string
  name: string
  running: boolean
}

