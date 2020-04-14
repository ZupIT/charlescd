export const DEPLOY_ACTION_TYPES = {
  LOADING: 'DEPLOYMENT/LOADING',
  LOADING_LIST: 'DEPLOYMENT/LOADING_LIST',
  CREATE: 'DEPLOYMENT/CREATE',
  DELETE: 'DEPLOYMENT/DELETE',
  GET_DEPLOYMENTS: 'DEPLOYMENT/GET_DEPLOYMENTS',
  GET_DEPLOYMENTS_BY_HYPOTHESIS_ID: 'DEPLOYMENT/GET_DEPLOYMENTS_BY_HYPOTHESIS_ID',
  LOADED_DEPLOYMENTS: 'DEPLOYMENT/LOADED_DEPLOYMENTS',
  GET_CHARTS: 'DEPLOYMENT/GET_CHARTS',
  LOADED_CHARTS: 'DEPLOYMENT/LOADED_CHARTS',
  GET_VALIDATED_BUILDS: 'DEPLOYMENT/GET_VALIDATED_BUILDS',
  LOADED_VALIDATED_BUILDS: 'DEPLOYMENT/LOADED_VALIDATED_BUILDS',
  START_POLLING: 'DEPLOYMENT/START_POLLING',
  STOP_POLLING: 'DEPLOYMENT/STOP_POLLING',
  UNDEPLOY: 'DEPLOYMENT/UNDEPLOY',
}

export const deploymentActions = {
  toggleLoading: () => ({ type: DEPLOY_ACTION_TYPES.LOADING }),
  toggleLoadingList: () => ({ type: DEPLOY_ACTION_TYPES.LOADING_LIST }),
  create: (data, hypothesisId) => ({ type: DEPLOY_ACTION_TYPES.CREATE, data, hypothesisId }),
  delete: deploymentId => ({ type: DEPLOY_ACTION_TYPES.DELETE, deploymentId }),
  getDeployments: hypothesisId => (
    { type: DEPLOY_ACTION_TYPES.GET_DEPLOYMENTS, hypothesisId }
  ),
  getDeploymentsByHypothesisId: hypothesisId => (
    { type: DEPLOY_ACTION_TYPES.GET_DEPLOYMENTS_BY_HYPOTHESIS_ID, hypothesisId }
  ),
  getValidatedBuilds: hypothesisId => (
    { type: DEPLOY_ACTION_TYPES.GET_VALIDATED_BUILDS, hypothesisId }
  ),
  loadedValidatedBuilds: builds => (
    { type: DEPLOY_ACTION_TYPES.LOADED_VALIDATED_BUILDS, builds }
  ),
  loadedDeployments: list => (
    { type: DEPLOY_ACTION_TYPES.LOADED_DEPLOYMENTS, list }
  ),
  getCharts: chartId => ({ type: DEPLOY_ACTION_TYPES.GET_CHARTS, chartId }),
  loadedCharts: charts => ({ type: DEPLOY_ACTION_TYPES.LOADED_CHARTS, charts }),
  startPolling: hypothesisId => ({ type: DEPLOY_ACTION_TYPES.START_POLLING, hypothesisId }),
  stopPolling: () => ({ type: DEPLOY_ACTION_TYPES.STOP_POLLING }),
  undeploy: deploymentId => ({ type: DEPLOY_ACTION_TYPES.UNDEPLOY, deploymentId }),
}
