import {
    HttpService,
    Inject,
    Injectable
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { IBaseSpinnakerPipeline, IUpdateSpinnakerPipeline } from './connector/interfaces'
import { ICreateSpinnakerApplication } from './interfaces'

@Injectable()
export class SpinnakerApiService {

    constructor(
        private readonly httpService: HttpService,
    ) {}

    public deployPipeline(applicationName: string, pipelineName: string, url: string): Observable<AxiosResponse> {
        return this.httpService.post(
            `${url}/pipelines/${applicationName}/${pipelineName}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    public createPipeline(spinnakerPipeline: IBaseSpinnakerPipeline, url: string): Observable<AxiosResponse> {
        return this.httpService.post(
            `${url}/pipelines`,
            spinnakerPipeline,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    public updatePipeline(updatedPipeline: IUpdateSpinnakerPipeline, url: string): Observable<AxiosResponse> {
        return this.httpService.post(
            `${url}/pipelines`,
            updatedPipeline,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    public getPipeline(applicationName: string, pipelineName: string, url: string): Observable<AxiosResponse> {
        return this.httpService.get(
        `${url}/applications/${applicationName}/pipelineConfigs/${pipelineName}`
        )
    }

    public createApplication(spinnakerApplication: ICreateSpinnakerApplication, url: string): Observable<AxiosResponse> {
        return this.httpService.post(
            `${url}/tasks`,
            spinnakerApplication,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    public getApplication(applicationName: string, url: string): Observable<AxiosResponse> {
        return this.httpService.get(
            `${url}/applications/${applicationName}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }
}
