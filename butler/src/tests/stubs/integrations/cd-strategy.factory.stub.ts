import { CdTypeEnum } from '../../../app/api/configurations/enums'
import { SpinnakerService } from '../../../app/core/integrations/cd/spinnaker'
import { OctopipeService } from '../../../app/core/integrations/cd/octopipe'

const serviceStub = {
    createDeployment: () => Promise.resolve(undefined)
}
export class CdStrategyFactoryStub {

    public create(type: CdTypeEnum): SpinnakerService | OctopipeService {
        return serviceStub as any
    }
}
