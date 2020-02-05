const baseDestinationRules = ({
  appName,
  appNamespace
}) => ({
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'DestinationRule',
  metadata: {
    name: appName,
    namespace: appNamespace
  },
  spec: {
    host: appName,
    subsets: []
  }
})

const createSubsets = ({
  versions,
  appName
}) => {
  return versions.map(({ version }) => ({
    labels: {
      version: `${appName}-${version}`
    },
    name: version
  }))
}

const createDestinationRules = (
  contract
) => {
  const newDestinationRule = baseDestinationRules(contract)
  if (contract.circles) {
    const subsetsToAdd = createSubsets(contract)
    newDestinationRule.spec.subsets = subsetsToAdd
  }
  return newDestinationRule
}

export default createDestinationRules
