export const MODULE_ACTION_TYPES = {
  LIST_LOADING: 'MODULE/LIST_LOADING',
  LOAD_MODULES: 'MODULES/LOAD_MODULES',
  GET_MODULES: 'MODULE/GET_MODULES',
}

export const moduleActions = {
  getModules: () => ({ type: MODULE_ACTION_TYPES.GET_MODULES }),
  loadModules: modules => ({ type: MODULE_ACTION_TYPES.LOAD_MODULES, modules }),
  listLoading: () => ({ type: MODULE_ACTION_TYPES.LIST_LOADING }),
}
