import { Observable,of } from 'rxjs';
import { AxiosResponse } from 'axios';

export class MooveServiceStub {

    public  notifyDeploymentStatus(): Observable<AxiosResponse> {
        return of({} as AxiosResponse)
    }
}
