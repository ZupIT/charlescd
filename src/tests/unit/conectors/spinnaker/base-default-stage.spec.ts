import 'jest'
import baseStage from '../../../../app/core/integrations/cd/spinnaker/connector/utils/base-default-stage'
import expectedEmpty from './fixtures/expected-stage-empty'
import expectedSingle from './fixtures/expected-single-expression'
import expectedMultiple from './fixtures/expected-multiple-expressions'
import { ISpinnakerBaseService } from '../../../../app/core/integrations/cd/spinnaker/connector/utils/manifests/base-service'

const manifest: ISpinnakerBaseService = {
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    labels: {
      app: 'darwin-ui',
      service: 'darwin-ui'
    },
    name: 'darwin-ui',
    namespace: 'qa'
  },
  spec: {
    ports: [
      {
        name: 'http',
        port: 3000,
        targetPort: 3000
      }
    ],
    selector: {
      app: 'darwin-ui'
    }
  }
}

describe('base default stage', () => {
  it('should build with empty stage', () => {

    expect(
      baseStage(manifest, 'stage', 'account', 'ref-id', ['ref-id-1', 'ref-id-2'], undefined)
    ).toEqual(expectedEmpty)
  })

  it('should build with a single expression', () => {
    expect(
      baseStage(manifest, 'stage', 'account', 'ref-id', ['ref-id-1', 'ref-id-2'], 'Stage 1')
    ).toEqual(expectedSingle)
  })

  it('should build with multiple expressions', () => {
    expect(
      baseStage(manifest, 'stage', 'account', 'ref-id', ['ref-id-1', 'ref-id-2'], ['Stage 1', 'Stage 2'])
    ).toEqual(expectedMultiple)
  })
})
