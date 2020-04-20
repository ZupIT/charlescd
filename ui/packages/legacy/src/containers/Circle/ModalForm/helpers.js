import reduce from 'lodash/reduce'
import findIndex from 'lodash/findIndex'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import flatMap from 'lodash/flatMap'
import { ZERO, ONE } from 'core/helpers/constants'
import { SEGMENTS_TYPE, MATCHER_TYPE } from './constants'

export const groupModulesById = (modules) => {
  return reduce(modules, (result, module) => {
    const index = findIndex(result, ({ id }) => id === module.id)
    if (index >= ZERO) {
      return Object.assign([], result, {
        [index]: {
          id: module.id,
          components: [
            ...result[index].components,
            ...module.components,
          ],
        },
      })
    }

    return [...result, module]
  }, [])
}

export const filterDataByName = (items, value) => {
  return isEmpty(value)
    ? items
    : filter(items, ({ name }) => name.toLowerCase().includes(value.toLowerCase()))
}

export const checkComponentsDuplicate = (modules, component) => {
  const duplicates = filter(
    flatMap(modules, mod => mod?.components), ({ id }) => id === component?.id,
  )

  return duplicates?.length > ONE
}

export function getAttentionMessage(matcherType, segmentType) {
  const isManualMessage = (
    matcherType === MATCHER_TYPE.SIMPLE_KV && segmentType === SEGMENTS_TYPE.MANUALLY
  )

  if (isManualMessage) {
    return 'circle.attention.message.manual'
  }

  return 'circle.attention.message.import'
}
