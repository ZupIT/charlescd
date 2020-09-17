import { formatDnsLabel } from '../../../../app/v1/core/integrations/cd/spinnaker/connector/utils/helpers/format-dns-label'

it('does not modify version if it matches the dns regex', () => {
  const version = 'v1-2'
  expect(formatDnsLabel(version)).toEqual('v1-2')
})

it('replaces only characters that dont match the regex', () => {
  const version = 'v1.2-3'
  expect(formatDnsLabel(version)).toEqual('v1-2-3')
})

it('replaces complex characters that dont match', () => {
  const version = '1 2 3 @ 379.2.1.2.3'
  expect(formatDnsLabel(version)).toEqual('1-2-3-379-2-1-2-3')
})
