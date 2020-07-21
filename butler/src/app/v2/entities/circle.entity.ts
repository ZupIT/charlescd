import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { DeploymentEntity } from './deployment.entity';

@Entity('v2circles')
export class CircleEntity {
  @PrimaryColumn('uuid')
  public id!: string

  @Column({name: 'header_value'})
  public headerValue!: string

  @Column({name: 'header_name'})
  public headerName!: string

  @ManyToOne(() => DeploymentEntity, deployment => deployment.circle)
  public deployments!: DeploymentEntity[]

}
