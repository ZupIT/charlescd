const baseVirtualService = ({
  appName,
  appNamespace
}) => ({
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'VirtualService',
  metadata: {
    name: appName,
    namespace: appNamespace
  },
  spec: {
    hosts: [appName],
    http: []
  }
})

const createXCircleIdHttpMatcher = (
  circle,
  appName
) => ({
  match: [
    {
      headers: {
        [circle.header.headerName]: {
          exact: circle.header.headerValue
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      }
    }
  ]
})

const createRegexHttpMatcher = (
  circle,
  appName
) => ({
  match: [
    {
      headers: {
        cookie: {
          regex: `.*x-circle-id=${circle.header.headerValue}.*`
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      }
    }
  ]
})

const createOpenSeaHttpMatcher = (
  circle,
  appName
) => ({
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      }
    }
  ]
})

const createHttpMatchers = ({
  circles,
  appName,
  uri
}) => {
  return circles.reduce((acc, circle) => {
    if (circle.header) {
      acc.push(createRegexHttpMatcher(circle, appName))
      acc.push(createXCircleIdHttpMatcher(circle, appName))
      return acc
    }
    acc.push(createOpenSeaHttpMatcher(circle, appName))
    return acc
  }, [])
}

const createVirtualService = (
  contract
) => {
  const newVirtualService = baseVirtualService(contract)
  const matchers = createHttpMatchers(contract)
  if (contract.hosts) {
    newVirtualService.spec.hosts = contract.hosts
  }
  newVirtualService.spec.http = matchers
  return newVirtualService
}

export default createVirtualService
