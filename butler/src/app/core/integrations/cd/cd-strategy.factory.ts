import { Injectable } from '@nestjs/common'
import { CdTypeEnum } from '../../../api/configurations/enums'
import { SpinnakerService } from './spinnaker'
import { OctopipeService } from './octopipe'
import { ICdServiceStrategy } from './interfaces'

@Injectable()
export class CdStrategyFactory {

    constructor(
        private readonly spinnakerService: SpinnakerService,
        private readonly octopipeService: OctopipeService
    ) {}

    public create(type: CdTypeEnum): ICdServiceStrategy {

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
