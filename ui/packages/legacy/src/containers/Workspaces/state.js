import map from 'lodash/map'
import find from 'lodash/find'

export const workspacesInitialState = {
  list: [],
  item: null,
}

export const workspacesTypes = {
  workspaces: 'LOADED/WORKSPACES',
  workspace: 'LOADED/WORKSPACE',
  updateWorkspaces: 'UPDATE/WORKSPACES',
  reset: 'RESET_WORKSPACE',
}

export const workspacesActions = {
  workspaces: list => ({ type: workspacesTypes.workspaces, list }),
  workspace: item => ({ type: workspacesTypes.workspace, item }),
  updateWorkspaces: item => ({ type: workspacesTypes.updateWorkspaces, item }),
}

export const workspacesReducer = (state = workspacesInitialState, action) => {
  switch (action?.type) {
    case workspacesTypes.workspaces:
      return {
        ...state,
        list: action.list,
      }
    case workspacesTypes.updateWorkspaces:
      if (find(state.list, ({ id }) => id === action.item.id)) {
        return {
          ...state,
          list: map(state.list, (item) => {
            if (item.id === action.item.id) {
              return { ...item, name: action.item.name }
            }

            return item
          }),
        }
      }

      return {
        ...state,
        list: [...state.list, action.item],
      }
    case workspacesTypes.workspace:
      return {
        ...state,
        item: action.item,
      }
    default:
      return state
  }
}
