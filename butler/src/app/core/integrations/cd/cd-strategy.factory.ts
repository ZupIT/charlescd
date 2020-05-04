import { Injectable } from '@nestjs/common'
import { CdTypeEnum } from '../../../api/configurations/enums'
import { SpinnakerService } from './spinnaker'
import { OctopipeService } from './octopipe'
import { ICdServiceStrategy } from './interfaces'
import { ConsoleLoggerService } from '../../logs/console';

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
                const error = new Error('invalid cd type value')
                this.consoleLoggerService.error('ERROR:INVALID CD TYPE VALUE', error)
                throw error

        }
    }
}
