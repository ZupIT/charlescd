import { of } from 'rxjs'

export class HttpServiceStub {
  public post() {
    return of({})
  }
  public get() {
    return of({})
  }
}
