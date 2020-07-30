import { ComponentEntity } from '../../../app/v1/api/components/entity'
import { IPipelineOptions } from '../../../app/v1/api/components/interfaces'

describe('ComponentEntity', () => {

  it('should return true if length is 1 ', async() => {

    const componentEntity = new ComponentEntity(
      'component-id',
      undefined,
      undefined
    )

    const pipelineOptions: IPipelineOptions = {
      pipelineCircles: [{ header: { headerName: 'x-dummy-header', headerValue: 'dummy-value' }, destination: { version: 'v1' } }],
      pipelineVersions: [{ version: 'v1', versionUrl: 'version.url/tag:123' }],
      pipelineUnusedVersions: [{ version: 'v2', versionUrl: 'version.url/tag:456' }]
    }
    componentEntity.pipelineOptions = pipelineOptions

    expect(componentEntity.isActive()).toBe(true)
  })

  it('should return false if length is 0 ', async() => {

    const componentEntity = new ComponentEntity(
      'component-id',
      undefined,
      undefined
    )

    expect(componentEntity.isActive()).toBe(false)
  })

})
