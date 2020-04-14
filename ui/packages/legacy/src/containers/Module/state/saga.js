import { takeEvery, call, put, all } from 'redux-saga/effects'
import ModulesApi from 'core/api/modules'
import { toasterActions } from 'containers/Toaster/state/actions'
import { MODULE_ACTION_TYPES, moduleActions } from './actions'

export function* getModules() {
  try {
    yield put(moduleActions.listLoading())
    const modules = yield call(ModulesApi.getModules)
    yield put(moduleActions.loadModules(modules))

  } catch (err) {
    yield put(toasterActions.toastFailed('message.error.unexpected'))

  } finally {
    yield put(moduleActions.listLoading())
  }
}

export default function* root() {
  yield all([
    takeEvery(MODULE_ACTION_TYPES.GET_MODULES, getModules),
  ])
}
