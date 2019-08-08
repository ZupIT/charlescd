import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'

@Entity('component_deployments')
export class ComponentDeployment extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public componentId: string

  @Column()
  public buildImageTag: string

  @Column()
  public buildImageName: string

  constructor(
    componentId: string,
    buildImageTag: string,
    buildImageName: string
  ) {
    super()
    this.componentId = componentId
    this.buildImageTag = buildImageTag
    this.buildImageName = buildImageName
  }
}
