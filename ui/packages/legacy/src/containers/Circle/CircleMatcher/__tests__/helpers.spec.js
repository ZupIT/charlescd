import { buildParameters, parseParameters } from '../helpers'
import { params } from './fixtures'

describe('Circle Matcher helpers', () => {
  test('should build parameters', () => {
    const buildedParams = buildParameters(params)

    expect(buildedParams).toMatchSnapshot()
  })

  test('Should build parameters with empty values', () => {
    expect(buildParameters({})).toEqual({})
    expect(buildParameters(null)).toEqual({})
    expect(buildParameters(undefined)).toEqual({})
  })

  test('Should parse parameters', () => {
    const parameters = '{ "foo": "bar" }'
    const parsedParams = parseParameters(parameters)
    expect(parsedParams).toMatchObject({ foo: 'bar' })
  })

  test('Should try to parse an invalid parameters', () => {
    const invalidJSON = 'foo{bar'
    const parsedParams = parseParameters(invalidJSON)
    expect(parsedParams).toBe(invalidJSON)
  })
})
