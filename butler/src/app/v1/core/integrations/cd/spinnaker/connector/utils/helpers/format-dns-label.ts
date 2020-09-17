export const formatDnsLabel = (version: string) : string => {
  const dns1123LabelFmt = new RegExp('[a-zA-Z0-9](?:[-a-zA-Z0-9]*[a-zA-Z0-9])?', 'g')
  const matches = version.match(dns1123LabelFmt)
  if (matches) {
    return matches.join('-')
  } else {
    return version
  }
}
