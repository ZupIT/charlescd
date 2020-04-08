import {
    HttpService,
    Inject,
    Injectable
} from '@nestjs/common'
import { IoCTokensConstants } from '../../../constants/ioc'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { IBaseSpinnakerPipeline } from './connector/interfaces'
import { ICreateSpinnakerApplication } from './interfaces'

@Injectable()
export class SpinnakerApiService {

    constructor(
        private readonly httpService: HttpService,
        @Inject(IoCTokensConstants.ENV_CONFIGURATION)
        private readonly envConfiguration: IEnvConfiguration
    ) {}

    public deployPipeline(applicationName: string, pipelineName: string): Observable<AxiosResponse> {
        return this.httpService.post(
            `${this.envConfiguration.spinnakerUrl}/pipelines/${applicationName}/${pipelineName}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    public createPipeline(spinnakerPipeline: IBaseSpinnakerPipeline): Observable<AxiosResponse> {
        return this.httpService.post(
            `${this.envConfiguration.spinnakerUrl}/pipelines`,
            spinnakerPipeline,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    public updatePipeline(updatedPipeline): Observable<AxiosResponse> {
        return this.httpService.post(
            `${this.envConfiguration.spinnakerUrl}/pipelines`,
            updatedPipeline,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    public getPipeline(applicationName: string, pipelineName: string): Observable<AxiosResponse> {
        return this.httpService.get(
        `${this.envConfiguration.spinnakerUrl}/applications/${applicationName}/pipelineConfigs/${pipelineName}`
        )
    }

    public createApplication(spinnakerApplication: ICreateSpinnakerApplication): Observable<AxiosResponse> {
        return this.httpService.post(
            `${this.envConfiguration.spinnakerUrl}/tasks`,
            spinnakerApplication,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    public getApplication(applicationName: string): Observable<AxiosResponse> {
        return this.httpService.get(
            `${this.envConfiguration.spinnakerUrl}/applications/${applicationName}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }
}
