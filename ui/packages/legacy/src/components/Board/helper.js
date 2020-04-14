import map from 'lodash/map'
import get from 'lodash/get'
import find from 'lodash/find'

const removeItem = (list, sourceIndex) => {
  const deleteCount = 1
  list.splice(sourceIndex, deleteCount)
}

const addItem = (list, destinationIndex, targetItem) => {
  const deleteCount = 0
  list.splice(destinationIndex, deleteCount, targetItem)
}

const arraySwap = (result, columns, type) => {
  const { destination, source } = result
  const { droppableId: sourceId, index: sourceIndex } = source
  const { droppableId: destinationId, index: destinationIndex } = destination
  const targetColumn = find(columns, column => column.id === sourceId)
  const targetItem = get(targetColumn, type)[sourceIndex]

  const newArray = map(columns, (column) => {
    const { id } = column

    if (id === sourceId) {
      removeItem(column[type], sourceIndex)
    }

    if (id === destinationId) {
      addItem(column[type], destinationIndex, targetItem)
    }

    return column
  })

  return newArray
}

export function reorder(result, cards, type) {
  const { destination, source } = result

  return destination && source ? arraySwap(result, cards, type) : cards
}
