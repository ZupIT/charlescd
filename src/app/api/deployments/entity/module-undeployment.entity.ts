import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { UndeploymentStatusEnum } from '../enums'
import { ComponentUndeploymentEntity } from './component-undeployment.entity'
import { UndeploymentEntity } from './undeployment.entity'

@Entity('module_undeployments')
export class ModuleUndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    type => UndeploymentEntity,
    undeployment => undeployment.moduleUndeployments,
  )
  @JoinColumn({ name: 'undeployment_id' })
  public undeployment: UndeploymentEntity

  @OneToMany(
    type => ComponentUndeploymentEntity,
    componentUndeployment => componentUndeployment.moduleUndeployment,
    { cascade: true }
  )
  public componentUndeployments: ComponentUndeploymentEntity[]

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(

  ) {
    super()

  }

  public toReadDto(): ReadModuleUndeploymentDto {
    return new ReadModuleUndeploymentDto(

    )
  }
}
