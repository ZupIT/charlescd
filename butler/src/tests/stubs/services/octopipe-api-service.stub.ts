import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'

export class OctopipeApiServiceStub {

    public deploy(): Observable<AxiosResponse> {
        return {} as Observable<AxiosResponse>
    }
}
