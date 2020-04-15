import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'

export class SpinnakerApiServiceStub {

    public deployPipeline(): Observable<AxiosResponse> {
        return {} as Observable<AxiosResponse>
    }

    public getPipeline(): Observable<AxiosResponse> {
        return {} as Observable<AxiosResponse>
    }

    public getApplication(): Observable<AxiosResponse> {
        return {} as Observable<AxiosResponse>
    }

    public createPipeline(): Observable<AxiosResponse> {
        return {} as Observable<AxiosResponse>
    }
}
