import reduce from 'lodash/reduce'

export const createReactSelect = (jsonFiles) => {
  return reduce(jsonFiles, (acc, jsonFile) => {
    const newValue = {
      value: jsonFile.metadata.name,
      label: jsonFile.metadata.name,
    }
    acc.push(newValue)

    return acc
  }, [])
}

export const formatSwitchText = field => field.split('.').join(' ')
