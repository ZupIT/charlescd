import {
    HttpService,
    Inject,
    Injectable
} from '@nestjs/common'
import { IoCTokensConstants } from '../../../constants/ioc'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { IOctopipeConfiguration } from './octopipe.service'

@Injectable()
export class OctopipeApiService {

    constructor(
        private readonly httpService: HttpService,
        @Inject(IoCTokensConstants.ENV_CONFIGURATION)
        private readonly envConfiguration: IEnvConfiguration
    ) {}

    public deploy(octopipeConfiguration: IOctopipeConfiguration): Observable<AxiosResponse> {
        return this.httpService.post(
            `${this.envConfiguration.octopipeUrl}`,
            octopipeConfiguration,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    }
}
