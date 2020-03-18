import { Injectable } from '@nestjs/common'
import { CdTypeEnum } from '../../../api/configurations/enums'
import { SpinnakerService } from './spinnaker'
import { OctopipeService } from '../octopipe'

@Injectable()
export class CdStrategyFactory {

    constructor(
        private readonly spinnakerService: SpinnakerService,
        private readonly octopipeService: OctopipeService
    ) {}

    // TODO return type that specify cd contract. For now, we'll return SpinnakeService | OctopipeService
    public create(type: CdTypeEnum): SpinnakerService | OctopipeService {

        switch (type) {
            case CdTypeEnum.SPINNAKER:
                return this.spinnakerService
            case CdTypeEnum.OCTOPIPE:
                return this.octopipeService
            default:
                throw new Error('Invalid cd type value')
        }
    }
}
