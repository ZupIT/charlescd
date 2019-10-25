import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { UndeploymentStatusEnum } from '../enums'
import { ModuleUndeploymentEntity } from './module-undeployment.entity'

@Entity('component_undeployments')
export class ComponentUndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    type => ModuleUndeploymentEntity,
    moduleUndeployment => moduleUndeployment.componentUndeployments
  )
  @JoinColumn({ name: 'module_undeployment_id' })
  public moduleUndeployment: ModuleUndeploymentEntity

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(

  ) {
    super()

  }

  public toReadDto(): ReadComponentUndeploymentDto {
    return new ReadComponentUndeploymentDto(

    )
  }
}
