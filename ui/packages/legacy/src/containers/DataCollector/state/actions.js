export const DATA_COLLECTOR_ACTION_TYPES = {
  SET_LOADER: 'DataCollector/SET_LOADER',
  GET_FIELDS: 'DataCollector/GET_FIELDS',
  GET_ALL_KEYS: 'DataCollector/GET_ALL_KEYS',
  SET_FIELDS: 'DataCollector/SET_FIELDS',
  SET_KEYS: 'DataCollector/SET_KEYS',
  SAVE_FIELDS: 'DataCollector/SAVE_FIELDS',
  SET_JSON_FILES: 'DataCollector/SAVE_JSON_FILES',
  SET_SELECT_VALUES: 'DataCollector/SET_SELECT_VALUES',
  SET_JSON_RESUME: 'DataCollector/SET_JSON_RESUME',
}

export const dataCollectorActions = {
  getFields: () => ({ type: DATA_COLLECTOR_ACTION_TYPES.GET_FIELDS }),
  getAllKeys: () => ({ type: DATA_COLLECTOR_ACTION_TYPES.GET_ALL_KEYS }),
  setFields: fieldsData => ({ type: DATA_COLLECTOR_ACTION_TYPES.SET_FIELDS, fieldsData }),
  setKeys: keys => ({ type: DATA_COLLECTOR_ACTION_TYPES.SET_KEYS, keys }),
  saveFields: fieldsData => ({ type: DATA_COLLECTOR_ACTION_TYPES.SAVE_FIELDS, fieldsData }),
  setJsonFiles: jsonFiles => ({ type: DATA_COLLECTOR_ACTION_TYPES.SET_JSON_FILES, jsonFiles }),
  setSelectValues: selectValues => ({
    type: DATA_COLLECTOR_ACTION_TYPES.SET_SELECT_VALUES,
    selectValues,
  }),
  setJsonResume: metadataName => ({
    type: DATA_COLLECTOR_ACTION_TYPES.SET_JSON_RESUME,
    metadataName,
  }),
  setLoader: () => ({ type: DATA_COLLECTOR_ACTION_TYPES.SET_LOADER }),
}
