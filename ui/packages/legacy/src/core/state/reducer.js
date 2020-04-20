import { workspacesInitialState, workspacesReducer } from 'containers/Workspaces/state'
import { modulesInitialState, modulesReducer } from 'containers/Modules/state'
import { groupsInitialState, groupsReducer } from 'containers/Groups/state'
import { usersInitialState, usersReducer } from 'containers/Users/state'
import { notificationsInitialState, notificationsReducer } from 'containers/Notification/state'
import { combineReducer } from './helpers'

export const rootState = {
  modules: modulesInitialState,
  groups: groupsInitialState,
  users: usersInitialState,
  workspaces: workspacesInitialState,
  notifications: notificationsInitialState,
}

export const rootReducer = combineReducer({
  modules: modulesReducer,
  groups: groupsReducer,
  users: usersReducer,
  workspaces: workspacesReducer,
  notifications: notificationsReducer,
})
