// @ts-nocheck
/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { useState, useCallback } from 'react';
import { useFetchData, useFetchStatus, FetchStatus } from 'core/providers/base/hooks';
import { getAllMetricsGroupsById, getMetricsGroupsResumeById, getAllMetricsProviders, createMetric, updateMetric, getAllDataSourceMetrics as getAllDataSourceMetricsRequest, createMetricGroup, updateMetricGroup, deleteMetricGroup, deleteMetricByMetricId, deleteActionByActionId, getChartDataByQuery, getAllActionsTypes, createAction, updateAction, getGroupActionById } from 'core/providers/metricsGroups';
import { buildParams, URLParams } from 'core/utils/query';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { MetricsGroup, MetricsGroupsResume, Metric, DataSource, ChartDataByQuery, ActionGroupPayload, ActionType, Action } from './types';
import { DetailedErrorResponse } from 'core/interfaces/ValidationError';
export const useMetricsGroupsResume = (): {
  getMetricsgroupsResume: Function;
  resume: MetricsGroupsResume[];
  status: FetchStatus;
} => {
  if (stryMutAct_9fa48("3242")) {
    {}
  } else {
    stryCov_9fa48("3242");
    const getMetricsGroupsResumeData = useFetchData<MetricsGroupsResume[]>(getMetricsGroupsResumeById);
    const status = useFetchStatus();
    const [resume, setResume] = useState(stryMutAct_9fa48("3243") ? ["Stryker was here"] : (stryCov_9fa48("3243"), []));
    const getMetricsgroupsResume = useCallback(async (payload: URLParams) => {
      if (stryMutAct_9fa48("3244")) {
        {}
      } else {
        stryCov_9fa48("3244");

        try {
          if (stryMutAct_9fa48("3245")) {
            {}
          } else {
            stryCov_9fa48("3245");
            status.pending();
            const params = buildParams(payload);
            const resumeResponse = await getMetricsGroupsResumeData(params);
            setResume(resumeResponse);
            status.resolved();
            return resumeResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3246")) {
            {}
          } else {
            stryCov_9fa48("3246");
            status.rejected();
          }
        }
      }
    }, stryMutAct_9fa48("3247") ? [] : (stryCov_9fa48("3247"), [getMetricsGroupsResumeData, status]));
    return stryMutAct_9fa48("3248") ? {} : (stryCov_9fa48("3248"), {
      getMetricsgroupsResume,
      resume,
      status
    });
  }
};
export const useMetricsGroups = (): {
  getMetricsGroups: Function;
  metricsGroups: MetricsGroup[];
  status: FetchStatus;
} => {
  if (stryMutAct_9fa48("3249")) {
    {}
  } else {
    stryCov_9fa48("3249");
    const getMetricsGroupData = useFetchData<MetricsGroup[]>(getAllMetricsGroupsById);
    const status = useFetchStatus();
    const [metricsGroups, setMetricsGroups] = useState<MetricsGroup[]>(stryMutAct_9fa48("3250") ? ["Stryker was here"] : (stryCov_9fa48("3250"), []));
    const getMetricsGroups = useCallback(async (circleId: string) => {
      if (stryMutAct_9fa48("3251")) {
        {}
      } else {
        stryCov_9fa48("3251");

        try {
          if (stryMutAct_9fa48("3252")) {
            {}
          } else {
            stryCov_9fa48("3252");
            status.pending();
            const metricsGroupsResponse = await getMetricsGroupData(circleId);
            setMetricsGroups(metricsGroupsResponse);
            status.resolved();
            return metricsGroupsResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3253")) {
            {}
          } else {
            stryCov_9fa48("3253");
            status.rejected();
          }
        }
      }
    }, stryMutAct_9fa48("3254") ? [] : (stryCov_9fa48("3254"), [getMetricsGroupData, status]));
    return stryMutAct_9fa48("3255") ? {} : (stryCov_9fa48("3255"), {
      getMetricsGroups,
      metricsGroups,
      status
    });
  }
};
export const useMetricProviders = () => {
  if (stryMutAct_9fa48("3256")) {
    {}
  } else {
    stryCov_9fa48("3256");
    const getMetricProvidersData = useFetchData<DataSource[]>(getAllMetricsProviders);
    const [providers, setProviders] = useState(stryMutAct_9fa48("3257") ? ["Stryker was here"] : (stryCov_9fa48("3257"), []));
    const getMetricsProviders = useCallback(async () => {
      if (stryMutAct_9fa48("3258")) {
        {}
      } else {
        stryCov_9fa48("3258");

        try {
          if (stryMutAct_9fa48("3259")) {
            {}
          } else {
            stryCov_9fa48("3259");
            const providersResponse = await getMetricProvidersData();
            setProviders(providersResponse);
            return providersResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3260")) {
            {}
          } else {
            stryCov_9fa48("3260");
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("3261") ? [] : (stryCov_9fa48("3261"), [getMetricProvidersData]));
    return stryMutAct_9fa48("3262") ? {} : (stryCov_9fa48("3262"), {
      getMetricsProviders,
      providers
    });
  }
};
export const useSaveMetric = (metricId: string) => {
  if (stryMutAct_9fa48("3263")) {
    {}
  } else {
    stryCov_9fa48("3263");
    const saveRequest = metricId ? updateMetric : createMetric;
    const saveMetricPayload = useFetchData<Metric>(saveRequest);
    const status = useFetchStatus();
    const dispatch = useDispatch();
    const saveMetric = useCallback(async (metricsGroupsId: string, metricPayload: Metric) => {
      if (stryMutAct_9fa48("3264")) {
        {}
      } else {
        stryCov_9fa48("3264");

        try {
          if (stryMutAct_9fa48("3265")) {
            {}
          } else {
            stryCov_9fa48("3265");
            status.pending();
            const savedMetricResponse = await saveMetricPayload(metricsGroupsId, metricPayload);
            status.resolved();
            return savedMetricResponse;
          }
        } catch (responseError) {
          if (stryMutAct_9fa48("3266")) {
            {}
          } else {
            stryCov_9fa48("3266");
            status.rejected();
            responseError.json().then((error: DetailedErrorResponse) => {
              if (stryMutAct_9fa48("3267")) {
                {}
              } else {
                stryCov_9fa48("3267");
                const errorMessage = stryMutAct_9fa48("3270") ? error.errors?.[0]?.detail : stryMutAct_9fa48("3269") ? error?.errors[0]?.detail : stryMutAct_9fa48("3268") ? error?.errors?.[0].detail : (stryCov_9fa48("3268", "3269", "3270"), error?.errors?.[0]?.detail);
                dispatch(toogleNotification(stryMutAct_9fa48("3271") ? {} : (stryCov_9fa48("3271"), {
                  text: stryMutAct_9fa48("3272") ? errorMessage && 'Error on save metric' : (stryCov_9fa48("3272"), errorMessage ?? (stryMutAct_9fa48("3273") ? "" : (stryCov_9fa48("3273"), 'Error on save metric'))),
                  status: stryMutAct_9fa48("3274") ? "" : (stryCov_9fa48("3274"), 'error')
                })));
              }
            });
          }
        }
      }
    }, stryMutAct_9fa48("3275") ? [] : (stryCov_9fa48("3275"), [saveMetricPayload, dispatch, status]));
    return stryMutAct_9fa48("3276") ? {} : (stryCov_9fa48("3276"), {
      saveMetric,
      status
    });
  }
};
export const useProviderMetrics = () => {
  if (stryMutAct_9fa48("3277")) {
    {}
  } else {
    stryCov_9fa48("3277");
    const getAllDataSourceMetricsData = useFetchData<string[]>(getAllDataSourceMetricsRequest);
    const getAllDataSourceMetrics = useCallback(async (datasourceId: string) => {
      if (stryMutAct_9fa48("3278")) {
        {}
      } else {
        stryCov_9fa48("3278");

        try {
          if (stryMutAct_9fa48("3279")) {
            {}
          } else {
            stryCov_9fa48("3279");
            const response = await getAllDataSourceMetricsData(datasourceId);
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3280")) {
            {}
          } else {
            stryCov_9fa48("3280");
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("3281") ? [] : (stryCov_9fa48("3281"), [getAllDataSourceMetricsData]));
    return stryMutAct_9fa48("3282") ? {} : (stryCov_9fa48("3282"), {
      getAllDataSourceMetrics
    });
  }
};
export const useCreateMetricsGroup = (metricGroupId: string) => {
  if (stryMutAct_9fa48("3283")) {
    {}
  } else {
    stryCov_9fa48("3283");
    const saveMetricGroupRequest = metricGroupId ? updateMetricGroup : createMetricGroup;
    const createMetricsGroupPayload = useFetchData<MetricsGroup>(saveMetricGroupRequest);
    const status = useFetchStatus();
    const dispatch = useDispatch();
    const createMetricsGroup = useCallback(async (name: string, circleId: string) => {
      if (stryMutAct_9fa48("3284")) {
        {}
      } else {
        stryCov_9fa48("3284");

        try {
          if (stryMutAct_9fa48("3285")) {
            {}
          } else {
            stryCov_9fa48("3285");
            status.pending();
            const createdMetricsGroupResponse = await createMetricsGroupPayload(stryMutAct_9fa48("3286") ? {} : (stryCov_9fa48("3286"), {
              name,
              circleId
            }), metricGroupId);
            status.resolved();
            return createdMetricsGroupResponse;
          }
        } catch (responseError) {
          if (stryMutAct_9fa48("3287")) {
            {}
          } else {
            stryCov_9fa48("3287");
            status.rejected();
            responseError.json().then((error: DetailedErrorResponse) => {
              if (stryMutAct_9fa48("3288")) {
                {}
              } else {
                stryCov_9fa48("3288");
                const errorMessage = stryMutAct_9fa48("3291") ? error.errors?.[0]?.detail : stryMutAct_9fa48("3290") ? error?.errors[0]?.detail : stryMutAct_9fa48("3289") ? error?.errors?.[0].detail : (stryCov_9fa48("3289", "3290", "3291"), error?.errors?.[0]?.detail);
                dispatch(toogleNotification(stryMutAct_9fa48("3292") ? {} : (stryCov_9fa48("3292"), {
                  text: stryMutAct_9fa48("3293") ? errorMessage && 'Error on save metric group' : (stryCov_9fa48("3293"), errorMessage ?? (stryMutAct_9fa48("3294") ? "" : (stryCov_9fa48("3294"), 'Error on save metric group'))),
                  status: stryMutAct_9fa48("3295") ? "" : (stryCov_9fa48("3295"), 'error')
                })));
              }
            });
          }
        }
      }
    }, stryMutAct_9fa48("3296") ? [] : (stryCov_9fa48("3296"), [createMetricsGroupPayload, status, dispatch, metricGroupId]));
    return stryMutAct_9fa48("3297") ? {} : (stryCov_9fa48("3297"), {
      createMetricsGroup,
      status
    });
  }
};
export const useDeleteMetricsGroup = () => {
  if (stryMutAct_9fa48("3298")) {
    {}
  } else {
    stryCov_9fa48("3298");
    const deleteMetricsGroupRequest = useFetchData<MetricsGroup>(deleteMetricGroup);
    const dispatch = useDispatch();
    const deleteMetricsGroup = useCallback(async (metricsGroupId: string) => {
      if (stryMutAct_9fa48("3299")) {
        {}
      } else {
        stryCov_9fa48("3299");

        try {
          if (stryMutAct_9fa48("3300")) {
            {}
          } else {
            stryCov_9fa48("3300");
            const deleteMetricsGroupResponse = await deleteMetricsGroupRequest(metricsGroupId);
            dispatch(toogleNotification(stryMutAct_9fa48("3301") ? {} : (stryCov_9fa48("3301"), {
              text: stryMutAct_9fa48("3302") ? `` : (stryCov_9fa48("3302"), `Success deleting metrics group`),
              status: stryMutAct_9fa48("3303") ? "" : (stryCov_9fa48("3303"), 'success')
            })));
            return deleteMetricsGroupResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3304")) {
            {}
          } else {
            stryCov_9fa48("3304");
            dispatch(toogleNotification(stryMutAct_9fa48("3305") ? {} : (stryCov_9fa48("3305"), {
              text: stryMutAct_9fa48("3306") ? `` : (stryCov_9fa48("3306"), `Error deleting metrics group`),
              status: stryMutAct_9fa48("3307") ? "" : (stryCov_9fa48("3307"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("3308") ? [] : (stryCov_9fa48("3308"), [deleteMetricsGroupRequest, dispatch]));
    return stryMutAct_9fa48("3309") ? {} : (stryCov_9fa48("3309"), {
      deleteMetricsGroup
    });
  }
};
export const useDeleteMetric = () => {
  if (stryMutAct_9fa48("3310")) {
    {}
  } else {
    stryCov_9fa48("3310");
    const deleteMetricRequest = useFetchData<MetricsGroup>(deleteMetricByMetricId);
    const dispatch = useDispatch();
    const deleteMetric = useCallback(async (metricsGroupId: string, metricId: string) => {
      if (stryMutAct_9fa48("3311")) {
        {}
      } else {
        stryCov_9fa48("3311");

        try {
          if (stryMutAct_9fa48("3312")) {
            {}
          } else {
            stryCov_9fa48("3312");
            const deleteMetricResponse = await deleteMetricRequest(metricsGroupId, metricId);
            dispatch(toogleNotification(stryMutAct_9fa48("3313") ? {} : (stryCov_9fa48("3313"), {
              text: stryMutAct_9fa48("3314") ? `` : (stryCov_9fa48("3314"), `Success deleting metric`),
              status: stryMutAct_9fa48("3315") ? "" : (stryCov_9fa48("3315"), 'success')
            })));
            return deleteMetricResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3316")) {
            {}
          } else {
            stryCov_9fa48("3316");
            dispatch(toogleNotification(stryMutAct_9fa48("3317") ? {} : (stryCov_9fa48("3317"), {
              text: stryMutAct_9fa48("3318") ? `` : (stryCov_9fa48("3318"), `Error metric delete`),
              status: stryMutAct_9fa48("3319") ? "" : (stryCov_9fa48("3319"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("3320") ? [] : (stryCov_9fa48("3320"), [deleteMetricRequest, dispatch]));
    return stryMutAct_9fa48("3321") ? {} : (stryCov_9fa48("3321"), {
      deleteMetric
    });
  }
};
export const useMetricQuery = () => {
  if (stryMutAct_9fa48("3322")) {
    {}
  } else {
    stryCov_9fa48("3322");
    const getMetricByQueryRequest = useFetchData<ChartDataByQuery>(getChartDataByQuery);
    const dispatch = useDispatch();
    const getMetricByQuery = useCallback(async (metricsGroupId: string, payload: URLParams) => {
      if (stryMutAct_9fa48("3323")) {
        {}
      } else {
        stryCov_9fa48("3323");

        try {
          if (stryMutAct_9fa48("3324")) {
            {}
          } else {
            stryCov_9fa48("3324");
            const params = buildParams(payload);
            const metricByQueryResponse = await getMetricByQueryRequest(metricsGroupId, params);
            return metricByQueryResponse;
          }
        } catch (responseError) {
          if (stryMutAct_9fa48("3325")) {
            {}
          } else {
            stryCov_9fa48("3325");
            dispatch(toogleNotification(stryMutAct_9fa48("3326") ? {} : (stryCov_9fa48("3326"), {
              text: stryMutAct_9fa48("3327") ? "" : (stryCov_9fa48("3327"), 'Error on loading metric chart data'),
              status: stryMutAct_9fa48("3328") ? "" : (stryCov_9fa48("3328"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("3329") ? [] : (stryCov_9fa48("3329"), [getMetricByQueryRequest, dispatch]));
    return stryMutAct_9fa48("3330") ? {} : (stryCov_9fa48("3330"), {
      getMetricByQuery
    });
  }
};
export const useActionTypes = () => {
  if (stryMutAct_9fa48("3331")) {
    {}
  } else {
    stryCov_9fa48("3331");
    const getAllActionsTypesRequest = useFetchData<ActionType[]>(getAllActionsTypes);
    const getAllActionsTypesData = useCallback(async () => {
      if (stryMutAct_9fa48("3332")) {
        {}
      } else {
        stryCov_9fa48("3332");

        try {
          if (stryMutAct_9fa48("3333")) {
            {}
          } else {
            stryCov_9fa48("3333");
            const response = await getAllActionsTypesRequest();
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3334")) {
            {}
          } else {
            stryCov_9fa48("3334");
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("3335") ? [] : (stryCov_9fa48("3335"), [getAllActionsTypesRequest]));
    return stryMutAct_9fa48("3336") ? {} : (stryCov_9fa48("3336"), {
      getAllActionsTypesData
    });
  }
};
export const useSaveAction = (actionId?: string) => {
  if (stryMutAct_9fa48("3337")) {
    {}
  } else {
    stryCov_9fa48("3337");
    const saveRequest = actionId ? updateAction : createAction;
    const saveActionPayload = useFetchData<ActionGroupPayload>(saveRequest);
    const status = useFetchStatus();
    const dispatch = useDispatch();
    const saveAction = useCallback(async (actionGroupPayload: ActionGroupPayload) => {
      if (stryMutAct_9fa48("3338")) {
        {}
      } else {
        stryCov_9fa48("3338");

        try {
          if (stryMutAct_9fa48("3339")) {
            {}
          } else {
            stryCov_9fa48("3339");
            status.pending();
            const savedActionResponse = await saveActionPayload(actionGroupPayload, actionId);
            status.resolved();
            dispatch(toogleNotification(stryMutAct_9fa48("3340") ? {} : (stryCov_9fa48("3340"), {
              text: stryMutAct_9fa48("3341") ? `` : (stryCov_9fa48("3341"), `The action ${actionGroupPayload.nickname} was successfully ${actionId ? stryMutAct_9fa48("3342") ? `` : (stryCov_9fa48("3342"), `edit`) : stryMutAct_9fa48("3343") ? `` : (stryCov_9fa48("3343"), `added`)}`),
              status: stryMutAct_9fa48("3344") ? "" : (stryCov_9fa48("3344"), 'success')
            })));
            return savedActionResponse;
          }
        } catch (error) {
          if (stryMutAct_9fa48("3345")) {
            {}
          } else {
            stryCov_9fa48("3345");
            status.rejected();
            dispatch(toogleNotification(stryMutAct_9fa48("3346") ? {} : (stryCov_9fa48("3346"), {
              text: stryMutAct_9fa48("3347") ? `` : (stryCov_9fa48("3347"), `An error occurred while trying to create the ${actionGroupPayload.nickname} ${actionId ? stryMutAct_9fa48("3348") ? `` : (stryCov_9fa48("3348"), `edit`) : stryMutAct_9fa48("3349") ? `` : (stryCov_9fa48("3349"), `added`)}`),
              status: stryMutAct_9fa48("3350") ? "" : (stryCov_9fa48("3350"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("3351") ? [] : (stryCov_9fa48("3351"), [saveActionPayload, status, dispatch, actionId]));
    return stryMutAct_9fa48("3352") ? {} : (stryCov_9fa48("3352"), {
      saveAction,
      status
    });
  }
};
export const useDeleteAction = () => {
  if (stryMutAct_9fa48("3353")) {
    {}
  } else {
    stryCov_9fa48("3353");
    const deleteActionRequest = useFetchData<MetricsGroup>(deleteActionByActionId);
    const dispatch = useDispatch();
    const deleteAction = useCallback(async (actionId: string, actionName: string) => {
      if (stryMutAct_9fa48("3354")) {
        {}
      } else {
        stryCov_9fa48("3354");

        try {
          if (stryMutAct_9fa48("3355")) {
            {}
          } else {
            stryCov_9fa48("3355");
            const deleteActionResponse = await deleteActionRequest(actionId);
            dispatch(toogleNotification(stryMutAct_9fa48("3356") ? {} : (stryCov_9fa48("3356"), {
              text: stryMutAct_9fa48("3357") ? `` : (stryCov_9fa48("3357"), `The action ${actionName} was successfully deleted.`),
              status: stryMutAct_9fa48("3358") ? "" : (stryCov_9fa48("3358"), 'success')
            })));
            return deleteActionResponse;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3359")) {
            {}
          } else {
            stryCov_9fa48("3359");
            dispatch(toogleNotification(stryMutAct_9fa48("3360") ? {} : (stryCov_9fa48("3360"), {
              text: stryMutAct_9fa48("3361") ? `` : (stryCov_9fa48("3361"), `Error deleting the action ${actionName}`),
              status: stryMutAct_9fa48("3362") ? "" : (stryCov_9fa48("3362"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("3363") ? [] : (stryCov_9fa48("3363"), [deleteActionRequest, dispatch]));
    return stryMutAct_9fa48("3364") ? {} : (stryCov_9fa48("3364"), {
      deleteAction
    });
  }
};
export const useActionTypeById = () => {
  if (stryMutAct_9fa48("3365")) {
    {}
  } else {
    stryCov_9fa48("3365");
    const getActionGroupById = useFetchData<Action>(getGroupActionById);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("3366") ? true : (stryCov_9fa48("3366"), false));
    const [actionData, setActionData] = useState<Action>();
    const getActionGroup = useCallback(async (actionId: string) => {
      if (stryMutAct_9fa48("3367")) {
        {}
      } else {
        stryCov_9fa48("3367");

        try {
          if (stryMutAct_9fa48("3368")) {
            {}
          } else {
            stryCov_9fa48("3368");
            setIsLoading(stryMutAct_9fa48("3369") ? false : (stryCov_9fa48("3369"), true));
            const response = await getActionGroupById(actionId);
            setActionData(response);
            setIsLoading(stryMutAct_9fa48("3370") ? true : (stryCov_9fa48("3370"), false));
            return response;
          }
        } catch (e) {
          if (stryMutAct_9fa48("3371")) {
            {}
          } else {
            stryCov_9fa48("3371");
            console.log(e);
          }
        }
      }
    }, stryMutAct_9fa48("3372") ? [] : (stryCov_9fa48("3372"), [getActionGroupById]));
    return stryMutAct_9fa48("3373") ? {} : (stryCov_9fa48("3373"), {
      getActionGroup,
      actionData,
      isLoading
    });
  }
};