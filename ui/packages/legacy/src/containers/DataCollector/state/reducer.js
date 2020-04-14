import { createReducer } from 'core/helpers/redux'
import filter from 'lodash/filter'
import { DATA_COLLECTOR_ACTION_TYPES } from './actions'

const initialState = {
  fields: {},
  jsonFiles: [],
  keys: [],
  selectValues: [],
  saveLoading: false,
}

const reducer = {
  [DATA_COLLECTOR_ACTION_TYPES.SET_LOADER](state) {
    return {
      ...state,
      saveLoading: !state.saveLoading,
    }
  },
  [DATA_COLLECTOR_ACTION_TYPES.SET_FIELDS](state, { fieldsData }) {
    return {
      ...state,
      fields: fieldsData,
    }
  },
  [DATA_COLLECTOR_ACTION_TYPES.SET_KEYS](state, { keysData }) {
    return {
      ...state,
      keys: keysData,
    }
  },
  [DATA_COLLECTOR_ACTION_TYPES.SET_JSON_FILES](state, { jsonFiles }) {
    return {
      ...state,
      jsonFiles,
    }
  },
  [DATA_COLLECTOR_ACTION_TYPES.SET_SELECT_VALUES](state, { selectValues }) {
    return {
      ...state,
      selectValues,
    }
  },
  [DATA_COLLECTOR_ACTION_TYPES.SET_JSON_RESUME](state, { metadataName }) {
    const jsonResume = filter(state.jsonFiles, jsonFile => jsonFile.metadata.name === metadataName)

    return {
      ...state,
      fields: jsonResume[0],
    }
  },
}

export default createReducer(initialState, reducer)
