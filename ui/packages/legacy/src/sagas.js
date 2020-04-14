import { all, fork } from 'redux-saga/effects'
import Circle from 'containers/Circle/state/saga'
import DataCollector from 'containers/DataCollector/state/saga'
import Deployment from 'containers/Deployment/state/saga'
import Hypothesis from 'containers/Hypothesis/state/saga'
import Moove from 'containers/Moove/state/saga'
import Problem from 'containers/Problems/state/saga'
import Toaster from 'containers/Toaster/state/saga'
import User from 'containers/User/state/saga'
import Modules from 'containers/Module/state/saga'
import Notification from 'containers/Notification/state/saga'

export default function* root() {
  yield all([
    fork(DataCollector),
    fork(Deployment),
    fork(Circle),
    fork(Hypothesis),
    fork(Moove),
    fork(Problem),
    fork(Toaster),
    fork(User),
    fork(Modules),
    fork(Notification),
  ])
}
