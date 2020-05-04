import 'jest'
import {
  createEmptyVirtualService,
  createVirtualService
} from '../../../../app/core/integrations/cd/spinnaker/connector/utils/manifests/base-virtual-service'
import expectedBaseVirtualService from './fixtures/expected-base-virtual-service'
import expectedEmptyVirtualService from './fixtures/expected-empty-virtual-service'

it('creates the virtual service when there is no header on the circle', () => {
  const appName = 'app-name'
  const appNamespace = 'app-namespace'
  const circles = [{ destination: { version: 'v3' }, header: { headerValue: 'header-value', headerName: 'header-name' } }]
  const uri = 'uri-name'
  const hosts = undefined
  const virtualService = createVirtualService(appName, appNamespace, circles, hosts)

  expect(virtualService).toEqual(expectedBaseVirtualService)
})

it('creates empty virtual service when there is no versions', () => {
  const appName = 'app-name'
  const appNamespace = 'app-namespace'
  const virtualService = createEmptyVirtualService(appName, appNamespace)

  expect(virtualService).toEqual(expectedEmptyVirtualService)

})
