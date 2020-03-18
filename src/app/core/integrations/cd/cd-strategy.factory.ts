import { Injectable } from '@nestjs/common'
import { CdTypeEnum } from '../../../api/configurations/enums'
import { SpinnakerService } from './spinnaker'

@Injectable()
export class CdStrategyFactory {

    constructor(
        private readonly spinnakerService: SpinnakerService
    ) {}

    // TODO return type that specify cd contract. For now, we'll return SpinnakeService | OctopipeService
    public create(type: CdTypeEnum): SpinnakerService {

        switch (type) {
            case CdTypeEnum.SPINNAKER:
                return this.spinnakerService
            default:
                throw new Error('Invalid cd type value')
        }
    }
}
