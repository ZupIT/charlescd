import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import dataCollector from 'containers/DataCollector/state/reducer'
import deployment from 'containers/Deployment/state/reducer'
import circle from 'containers/Circle/state/reducer'
import hypothesis from 'containers/Hypothesis/state/reducer'
import moove from 'containers/Moove/state/reducer'
import problem from 'containers/Problems/state/reducer'
import toaster from 'containers/Toaster/state/reducer'
import user from 'containers/User/state/reducer'
import modules from 'containers/Module/state/reducer'
import notification from 'containers/Notification/state/reducer'

export default combineReducers({
  dataCollector,
  deployment,
  circle,
  hypothesis,
  moove,
  problem,
  routing,
  toaster,
  user,
  modules,
  notification,
})
