import { Allow } from 'class-validator'
import { ComponentEntity } from '../../components/entity'

export class CreateComponentDto {

    @Allow()
    public readonly id: string

    constructor(
        id: string
    ) {
        this.id = id
    }

    public toEntity(): ComponentEntity {
        return new ComponentEntity(
            this.id
        )
    }
}
