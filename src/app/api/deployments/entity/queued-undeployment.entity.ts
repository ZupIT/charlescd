import {ChildEntity, Column, CreateDateColumn, PrimaryGeneratedColumn} from 'typeorm'
import {QueuedPipelineStatusEnum} from '../enums'
import {ReadQueuedDeploymentDto} from '../dto'
import {QueuedDeploymentEntity} from './queued-deployment.entity'

@ChildEntity()
export class QueuedUndeploymentEntity extends QueuedDeploymentEntity {

    @Column({ name: 'component_undeployment_id' })
    public componentUndeploymentId: string

    constructor(
        componentId: string,
        componentDeploymentId: string,
        status: QueuedPipelineStatusEnum,
        componentUndeploymentId: string
    ) {
        super(componentId, componentDeploymentId, status)
        this.componentUndeploymentId = componentUndeploymentId
    }

    public toReadDto(): ReadQueuedDeploymentDto {
        return new ReadQueuedDeploymentDto(
            this.id,
            this.componentId,
            this.componentDeploymentId,
            this.status,
            this.createdAt
        )
    }
}
