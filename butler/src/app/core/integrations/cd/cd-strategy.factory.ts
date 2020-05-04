import { Injectable } from '@nestjs/common'
import { CdTypeEnum } from '../../../api/configurations/enums'
import { SpinnakerService } from './spinnaker'
import { OctopipeService } from './octopipe'
import { ICdServiceStrategy } from './interfaces'
import { ConsoleLoggerService } from '../../logs/console'

@Injectable()
export class CdStrategyFactory {

    constructor(
        private readonly spinnakerService: SpinnakerService,
        private readonly octopipeService: OctopipeService,
        private readonly consoleLoggerService: ConsoleLoggerService
    ) {}

    public create(type: CdTypeEnum): ICdServiceStrategy {

        switch (type) {
            case CdTypeEnum.SPINNAKER:
                return this.spinnakerService
            case CdTypeEnum.OCTOPIPE:
                return this.octopipeService
            default:
                this.consoleLoggerService.error('ERROR:INVALID_CD_TYPE_VALUE', type)
                throw new Error('invalid cd type value')

        }
    }
}
