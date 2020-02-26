import { Injectable } from '@nestjs/common'
import { ReadK8sConfigurationDto } from '../dto'

@Injectable()
export class CreateK8sConfigurationUsecase {

    constructor(
    ) {}

    public async execute(

    ): Promise<ReadK8sConfigurationDto> {

        try {

        } catch (error) {
            return Promise.reject({ error })
        }
    }
}
