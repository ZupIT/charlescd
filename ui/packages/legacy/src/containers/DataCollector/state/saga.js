import { takeEvery, all, call, put } from 'redux-saga/effects'
import { Base64 } from 'js-base64'
import { toasterActions } from 'containers/Toaster/state/actions'
import map from 'lodash/map'
import DataCollector from 'core/api/dataCollector'
import { DATA_COLLECTOR_ACTION_TYPES, dataCollectorActions } from './actions'
import { createReactSelect } from '../helpers'

function* getField(id) {
  const fieldsBase64 = yield call(DataCollector.getFields, id)
  const fieldsData = JSON.parse(Base64.decode(fieldsBase64[0].Value))

  return fieldsData
}

export function* getFields(ids) {
  try {
    const jsonFiles = yield all(map(ids, id => call(getField, id)))
    yield put(dataCollectorActions.setJsonFiles(jsonFiles))
    const selectValues = yield call(createReactSelect, jsonFiles)
    yield put(dataCollectorActions.setSelectValues(selectValues))
    yield put(dataCollectorActions.setFields(jsonFiles[0]))
  } catch (error) {
    yield console.log(error, 'SAGA ERROR')
  } finally {
    yield console.log('SAGA FINISH')
  }
}

export function* getAllKeys() {
  try {
    const keysList = yield call(DataCollector.getAllKeys)
    yield put(dataCollectorActions.setKeys(keysList))
    yield call(getFields, keysList)
  } catch (error) {
    yield console.log(error, 'SAGA ERROR')
  } finally {
    yield console.log('SAGA FINISH')
  }
}

export function* saveFields({ fieldsData }) {
  try {
    yield put(dataCollectorActions.setLoader())
    yield call(DataCollector.saveFields, JSON.stringify(fieldsData))
    yield put(toasterActions.toastSuccess('jsonData.save.success'))
    yield call(getFields)
  } catch (error) {
    yield put(dataCollectorActions.setLoader())
    yield put(toasterActions.toastFailed('jsonData.save.error'))
  } finally {
    yield put(dataCollectorActions.setLoader())
  }
}

export default function* root() {
  yield all([
    takeEvery(DATA_COLLECTOR_ACTION_TYPES.GET_FIELDS, getFields),
    takeEvery(DATA_COLLECTOR_ACTION_TYPES.SAVE_FIELDS, saveFields),
    takeEvery(DATA_COLLECTOR_ACTION_TYPES.GET_ALL_KEYS, getAllKeys),
  ])
}
