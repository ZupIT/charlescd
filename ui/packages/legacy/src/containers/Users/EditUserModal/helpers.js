import differenceBy from 'lodash/differenceBy'

export const getAvailableItems = (allItems, userItems) => {
  return differenceBy(allItems, userItems, item => item.id)
}

export const getWorkspaceUsers = (application, allAplications = []) => {
  const maybeApplication = allAplications.find(({ id }) => id === application)

  return maybeApplication?.users
}
