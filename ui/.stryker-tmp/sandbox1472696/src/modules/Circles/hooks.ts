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
// @ts-nocheck

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

import { useEffect, useCallback, useState } from 'react';
import { useFetch, useFetchData } from 'core/providers/base/hooks';
import { findAllCircles, findPercentageCircles, findCircleById, findComponents, deleteCircleById, updateCircleWithFile, createCircleWithFile, createCircleManually, updateCircleManually, findAllCirclesWithoutActive, updateCirclePercentage, createCirclePercentage, findAllCirclesSimple } from 'core/providers/circle';
import { undeploy } from 'core/providers/deployment';
import { useDispatch } from 'core/state/hooks';
import { loadedCirclesAction, loadedCirclesMetricsAction } from './state/actions';
import { CirclePercentagePagination, CirclePagination } from './interfaces/CirclesPagination';
import { Circle, Component, CreateCircleWithFilePayload, CreateCircleManuallyPayload, Deployment, CreateCirclePercentagePayload } from './interfaces/Circle';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { buildFormData } from './helpers';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import { Pagination } from 'core/interfaces/Pagination';
export enum CIRCLE_TYPES {
  metrics = 'metrics',
  list = 'list',
}
export enum CIRCLE_STATUS {
  active = 'actives',
  inactives = 'inactives',
  hypotheses = 'hypotheses',
}
export const useCircle = () => {
  if (stryMutAct_9fa48("4021")) {
    {}
  } else {
    stryCov_9fa48("4021");
    const [circle, getCircle] = useFetch<Circle>(findCircleById);
    const [componentsResponse, getComponents] = useFetch<Component[]>(findComponents);
    const {
      response: circleResponse,
      loading
    } = circle;
    const {
      response: components
    } = componentsResponse;
    const loadCircle = useCallback((id: string) => {
      if (stryMutAct_9fa48("4022")) {
        {}
      } else {
        stryCov_9fa48("4022");
        getCircle(stryMutAct_9fa48("4023") ? {} : (stryCov_9fa48("4023"), {
          id
        }));
      }
    }, stryMutAct_9fa48("4024") ? [] : (stryCov_9fa48("4024"), [getCircle]));
    const loadComponents = useCallback((id: string) => {
      if (stryMutAct_9fa48("4025")) {
        {}
      } else {
        stryCov_9fa48("4025");
        getComponents(id);
      }
    }, stryMutAct_9fa48("4026") ? [] : (stryCov_9fa48("4026"), [getComponents]));
    return stryMutAct_9fa48("4027") ? [] : (stryCov_9fa48("4027"), [stryMutAct_9fa48("4028") ? {} : (stryCov_9fa48("4028"), {
      circleResponse,
      loading,
      components
    }), stryMutAct_9fa48("4029") ? {} : (stryCov_9fa48("4029"), {
      loadCircle,
      loadComponents
    })]);
  }
};
export const useCirclePolling = (): {
  pollingCircle: Function;
  resetStatus: () => void;
  status: string;
  response: Circle;
} => {
  if (stryMutAct_9fa48("4030")) {
    {}
  } else {
    stryCov_9fa48("4030");
    const [,, getCircle] = useFetch<Circle>(findCircleById);
    const [status, setStatus] = useState(stryMutAct_9fa48("4031") ? "" : (stryCov_9fa48("4031"), 'idle'));
    const [response, setResponse] = useState<Circle>(null);
    const resetStatus = stryMutAct_9fa48("4032") ? () => undefined : (stryCov_9fa48("4032"), (() => {
      const resetStatus = () => setStatus(stryMutAct_9fa48("4033") ? "" : (stryCov_9fa48("4033"), 'idle'));

      return resetStatus;
    })());
    const pollingCircle = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("4034")) {
        {}
      } else {
        stryCov_9fa48("4034");

        try {
          if (stryMutAct_9fa48("4035")) {
            {}
          } else {
            stryCov_9fa48("4035");
            setStatus(stryMutAct_9fa48("4036") ? "" : (stryCov_9fa48("4036"), 'pending'));
            const data = await getCircle(stryMutAct_9fa48("4037") ? {} : (stryCov_9fa48("4037"), {
              id
            }));
            setResponse(data);
            setStatus(stryMutAct_9fa48("4038") ? "" : (stryCov_9fa48("4038"), 'resolved'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("4039")) {
            {}
          } else {
            stryCov_9fa48("4039");
            setStatus(stryMutAct_9fa48("4040") ? "" : (stryCov_9fa48("4040"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("4041") ? [] : (stryCov_9fa48("4041"), [getCircle]));
    return stryMutAct_9fa48("4042") ? {} : (stryCov_9fa48("4042"), {
      pollingCircle,
      response,
      status,
      resetStatus
    });
  }
};
export const useDeleteCircle = (): [Function, string] => {
  if (stryMutAct_9fa48("4043")) {
    {}
  } else {
    stryCov_9fa48("4043");
    const [deleteData, deleteCircle] = useFetch<Circle>(deleteCircleById);
    const [circleName, setCircleName] = useState(undefined);
    const [circleStatus, setCircleStatus] = useState(stryMutAct_9fa48("4044") ? "Stryker was here!" : (stryCov_9fa48("4044"), ''));
    const {
      response,
      error
    } = deleteData;
    const dispatch = useDispatch();
    const delCircle = useCallback((id: string, deployStatus: string, circleName: string) => {
      if (stryMutAct_9fa48("4045")) {
        {}
      } else {
        stryCov_9fa48("4045");
        setCircleName(circleName);

        if (stryMutAct_9fa48("4048") ? deployStatus !== undefined : stryMutAct_9fa48("4047") ? false : stryMutAct_9fa48("4046") ? true : (stryCov_9fa48("4046", "4047", "4048"), deployStatus === undefined)) {
          if (stryMutAct_9fa48("4049")) {
            {}
          } else {
            stryCov_9fa48("4049");
            deleteCircle(id);
          }
        } else {
          if (stryMutAct_9fa48("4050")) {
            {}
          } else {
            stryCov_9fa48("4050");
            dispatch(toogleNotification(stryMutAct_9fa48("4051") ? {} : (stryCov_9fa48("4051"), {
              text: stryMutAct_9fa48("4052") ? `` : (stryCov_9fa48("4052"), `The circle ${circleName} could not be deleted.`),
              status: stryMutAct_9fa48("4053") ? "" : (stryCov_9fa48("4053"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4054") ? [] : (stryCov_9fa48("4054"), [deleteCircle, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("4055")) {
        {}
      } else {
        stryCov_9fa48("4055");

        if (stryMutAct_9fa48("4057") ? false : stryMutAct_9fa48("4056") ? true : (stryCov_9fa48("4056", "4057"), error)) {
          if (stryMutAct_9fa48("4058")) {
            {}
          } else {
            stryCov_9fa48("4058");
            dispatch(toogleNotification(stryMutAct_9fa48("4059") ? {} : (stryCov_9fa48("4059"), {
              text: stryMutAct_9fa48("4060") ? `` : (stryCov_9fa48("4060"), `The circle ${circleName} could not be deleted.`),
              status: stryMutAct_9fa48("4061") ? "" : (stryCov_9fa48("4061"), 'error')
            })));
          }
        } else if (stryMutAct_9fa48("4063") ? false : stryMutAct_9fa48("4062") ? true : (stryCov_9fa48("4062", "4063"), response)) {
          if (stryMutAct_9fa48("4064")) {
            {}
          } else {
            stryCov_9fa48("4064");
            setCircleStatus(stryMutAct_9fa48("4065") ? "" : (stryCov_9fa48("4065"), 'Deleted'));
            dispatch(toogleNotification(stryMutAct_9fa48("4066") ? {} : (stryCov_9fa48("4066"), {
              text: stryMutAct_9fa48("4067") ? `` : (stryCov_9fa48("4067"), `The circle ${circleName} has been deleted.`),
              status: stryMutAct_9fa48("4068") ? "" : (stryCov_9fa48("4068"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4069") ? [] : (stryCov_9fa48("4069"), [response, error, dispatch, circleName]));
    return stryMutAct_9fa48("4070") ? [] : (stryCov_9fa48("4070"), [delCircle, circleStatus]);
  }
};
export const useCirclesActive = () => {
  if (stryMutAct_9fa48("4071")) {
    {}
  } else {
    stryCov_9fa48("4071");
    const getCirclesData = useFetchData<Pagination<Circle>>(findAllCirclesWithoutActive);
    return stryMutAct_9fa48("4072") ? {} : (stryCov_9fa48("4072"), {
      getCirclesData
    });
  }
};
export const useCircleSimple = () => {
  if (stryMutAct_9fa48("4073")) {
    {}
  } else {
    stryCov_9fa48("4073");
    const getCirclesSimple = useFetchData<Pagination<Circle>>(findAllCirclesSimple);
    return stryMutAct_9fa48("4074") ? {} : (stryCov_9fa48("4074"), {
      getCirclesSimple
    });
  }
};
export const useCircles = (type: CIRCLE_TYPES): [boolean, Function, Function, CirclePagination] => {
  if (stryMutAct_9fa48("4075")) {
    {}
  } else {
    stryCov_9fa48("4075");
    const dispatch = useDispatch();
    const [circlesData, getCircles] = useFetch<CirclePagination>(findAllCircles);
    const {
      response,
      error,
      loading
    } = circlesData;
    const filterCircles = useCallback(({
      name,
      status,
      page
    }) => {
      if (stryMutAct_9fa48("4076")) {
        {}
      } else {
        stryCov_9fa48("4076");

        if (stryMutAct_9fa48("4079") ? status !== CIRCLE_STATUS.active : stryMutAct_9fa48("4078") ? false : stryMutAct_9fa48("4077") ? true : (stryCov_9fa48("4077", "4078", "4079"), status === CIRCLE_STATUS.active)) {
          if (stryMutAct_9fa48("4080")) {
            {}
          } else {
            stryCov_9fa48("4080");
            getCircles(stryMutAct_9fa48("4081") ? {} : (stryCov_9fa48("4081"), {
              name,
              page,
              active: stryMutAct_9fa48("4082") ? false : (stryCov_9fa48("4082"), true)
            }));
          }
        } else if (stryMutAct_9fa48("4085") ? status !== CIRCLE_STATUS.inactives : stryMutAct_9fa48("4084") ? false : stryMutAct_9fa48("4083") ? true : (stryCov_9fa48("4083", "4084", "4085"), status === CIRCLE_STATUS.inactives)) {
          if (stryMutAct_9fa48("4086")) {
            {}
          } else {
            stryCov_9fa48("4086");
            getCircles(stryMutAct_9fa48("4087") ? {} : (stryCov_9fa48("4087"), {
              name,
              page,
              active: stryMutAct_9fa48("4088") ? true : (stryCov_9fa48("4088"), false)
            }));
          }
        }
      }
    }, stryMutAct_9fa48("4089") ? [] : (stryCov_9fa48("4089"), [getCircles]));
    useEffect(() => {
      if (stryMutAct_9fa48("4090")) {
        {}
      } else {
        stryCov_9fa48("4090");
        if (stryMutAct_9fa48("4093") ? false : stryMutAct_9fa48("4092") ? true : stryMutAct_9fa48("4091") ? response : (stryCov_9fa48("4091", "4092", "4093"), !response)) return;

        if (stryMutAct_9fa48("4096") ? !error || type === CIRCLE_TYPES.list : stryMutAct_9fa48("4095") ? false : stryMutAct_9fa48("4094") ? true : (stryCov_9fa48("4094", "4095", "4096"), (stryMutAct_9fa48("4097") ? error : (stryCov_9fa48("4097"), !error)) && (stryMutAct_9fa48("4100") ? type !== CIRCLE_TYPES.list : stryMutAct_9fa48("4099") ? false : stryMutAct_9fa48("4098") ? true : (stryCov_9fa48("4098", "4099", "4100"), type === CIRCLE_TYPES.list)))) {
          if (stryMutAct_9fa48("4101")) {
            {}
          } else {
            stryCov_9fa48("4101");
            dispatch(loadedCirclesAction(response));
          }
        } else if (stryMutAct_9fa48("4104") ? !error || type === CIRCLE_TYPES.metrics : stryMutAct_9fa48("4103") ? false : stryMutAct_9fa48("4102") ? true : (stryCov_9fa48("4102", "4103", "4104"), (stryMutAct_9fa48("4105") ? error : (stryCov_9fa48("4105"), !error)) && (stryMutAct_9fa48("4108") ? type !== CIRCLE_TYPES.metrics : stryMutAct_9fa48("4107") ? false : stryMutAct_9fa48("4106") ? true : (stryCov_9fa48("4106", "4107", "4108"), type === CIRCLE_TYPES.metrics)))) {
          if (stryMutAct_9fa48("4109")) {
            {}
          } else {
            stryCov_9fa48("4109");
            dispatch(loadedCirclesMetricsAction(response));
          }
        } else {
          if (stryMutAct_9fa48("4110")) {
            {}
          } else {
            stryCov_9fa48("4110");
            console.error(error);
          }
        }
      }
    }, stryMutAct_9fa48("4111") ? [] : (stryCov_9fa48("4111"), [dispatch, response, error, type]));
    return stryMutAct_9fa48("4112") ? [] : (stryCov_9fa48("4112"), [loading, filterCircles, getCircles, response]);
  }
};
export const useSaveCirclePercentage = (circleId: string): [Circle, Function, boolean] => {
  if (stryMutAct_9fa48("4113")) {
    {}
  } else {
    stryCov_9fa48("4113");
    const saveCircleRequest = (stryMutAct_9fa48("4116") ? circleId === NEW_TAB : stryMutAct_9fa48("4115") ? false : stryMutAct_9fa48("4114") ? true : (stryCov_9fa48("4114", "4115", "4116"), circleId !== NEW_TAB)) ? updateCirclePercentage : createCirclePercentage;
    const [circleData, saveCircle] = useFetch<Circle>(saveCircleRequest);
    const {
      response,
      error,
      loading: isSaving
    } = circleData;
    const dispatch = useDispatch();
    const saveCirclePercentage = useCallback((circle: CreateCirclePercentagePayload) => {
      if (stryMutAct_9fa48("4117")) {
        {}
      } else {
        stryCov_9fa48("4117");
        saveCircle(circle, circleId);
      }
    }, stryMutAct_9fa48("4118") ? [] : (stryCov_9fa48("4118"), [saveCircle, circleId]));
    useEffect(() => {
      if (stryMutAct_9fa48("4119")) {
        {}
      } else {
        stryCov_9fa48("4119");

        if (stryMutAct_9fa48("4121") ? false : stryMutAct_9fa48("4120") ? true : (stryCov_9fa48("4120", "4121"), error)) {
          if (stryMutAct_9fa48("4122")) {
            {}
          } else {
            stryCov_9fa48("4122");
            dispatch(toogleNotification(stryMutAct_9fa48("4123") ? {} : (stryCov_9fa48("4123"), {
              text: stryMutAct_9fa48("4124") ? `` : (stryCov_9fa48("4124"), `Error to save circle`),
              status: stryMutAct_9fa48("4125") ? "" : (stryCov_9fa48("4125"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4126") ? [] : (stryCov_9fa48("4126"), [error, dispatch]));
    return stryMutAct_9fa48("4127") ? [] : (stryCov_9fa48("4127"), [response, saveCirclePercentage, isSaving]);
  }
};
export const useCirclePercentage = (): [CirclePercentagePagination, Function, Function, boolean] => {
  if (stryMutAct_9fa48("4128")) {
    {}
  } else {
    stryCov_9fa48("4128");
    const [circleData, getCircles] = useFetch<CirclePercentagePagination>(findPercentageCircles);
    const {
      response,
      error,
      loading: isSaving
    } = circleData;
    const dispatch = useDispatch();
    const filterCircles = useCallback((name: string, status: string) => {
      if (stryMutAct_9fa48("4129")) {
        {}
      } else {
        stryCov_9fa48("4129");

        if (stryMutAct_9fa48("4132") ? status !== CIRCLE_STATUS.active : stryMutAct_9fa48("4131") ? false : stryMutAct_9fa48("4130") ? true : (stryCov_9fa48("4130", "4131", "4132"), status === CIRCLE_STATUS.active)) {
          if (stryMutAct_9fa48("4133")) {
            {}
          } else {
            stryCov_9fa48("4133");
            getCircles(stryMutAct_9fa48("4134") ? {} : (stryCov_9fa48("4134"), {
              name,
              active: stryMutAct_9fa48("4135") ? false : (stryCov_9fa48("4135"), true)
            }));
          }
        } else if (stryMutAct_9fa48("4138") ? status !== CIRCLE_STATUS.inactives : stryMutAct_9fa48("4137") ? false : stryMutAct_9fa48("4136") ? true : (stryCov_9fa48("4136", "4137", "4138"), status === CIRCLE_STATUS.inactives)) {
          if (stryMutAct_9fa48("4139")) {
            {}
          } else {
            stryCov_9fa48("4139");
            getCircles(stryMutAct_9fa48("4140") ? {} : (stryCov_9fa48("4140"), {
              name,
              active: stryMutAct_9fa48("4141") ? true : (stryCov_9fa48("4141"), false)
            }));
          }
        }
      }
    }, stryMutAct_9fa48("4142") ? [] : (stryCov_9fa48("4142"), [getCircles]));
    useEffect(() => {
      if (stryMutAct_9fa48("4143")) {
        {}
      } else {
        stryCov_9fa48("4143");

        if (stryMutAct_9fa48("4145") ? false : stryMutAct_9fa48("4144") ? true : (stryCov_9fa48("4144", "4145"), error)) {
          if (stryMutAct_9fa48("4146")) {
            {}
          } else {
            stryCov_9fa48("4146");
            dispatch(toogleNotification(stryMutAct_9fa48("4147") ? {} : (stryCov_9fa48("4147"), {
              text: stryMutAct_9fa48("4148") ? `` : (stryCov_9fa48("4148"), `Error to fetch percentage circle`),
              status: stryMutAct_9fa48("4149") ? "" : (stryCov_9fa48("4149"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4150") ? [] : (stryCov_9fa48("4150"), [error, dispatch]));
    return stryMutAct_9fa48("4151") ? [] : (stryCov_9fa48("4151"), [response, filterCircles, getCircles, isSaving]);
  }
};
export const useSaveCircleManually = (circleId: string): [Circle, Function, boolean] => {
  if (stryMutAct_9fa48("4152")) {
    {}
  } else {
    stryCov_9fa48("4152");
    const saveCircleRequest = (stryMutAct_9fa48("4155") ? circleId === NEW_TAB : stryMutAct_9fa48("4154") ? false : stryMutAct_9fa48("4153") ? true : (stryCov_9fa48("4153", "4154", "4155"), circleId !== NEW_TAB)) ? updateCircleManually : createCircleManually;
    const [circleData, saveCircle] = useFetch<Circle>(saveCircleRequest);
    const {
      response,
      error,
      loading: isSaving
    } = circleData;
    const dispatch = useDispatch();
    const saveCircleManually = useCallback((circle: CreateCircleManuallyPayload) => {
      if (stryMutAct_9fa48("4156")) {
        {}
      } else {
        stryCov_9fa48("4156");
        saveCircle(circle, circleId);
      }
    }, stryMutAct_9fa48("4157") ? [] : (stryCov_9fa48("4157"), [saveCircle, circleId]));
    useEffect(() => {
      if (stryMutAct_9fa48("4158")) {
        {}
      } else {
        stryCov_9fa48("4158");

        if (stryMutAct_9fa48("4160") ? false : stryMutAct_9fa48("4159") ? true : (stryCov_9fa48("4159", "4160"), error)) {
          if (stryMutAct_9fa48("4161")) {
            {}
          } else {
            stryCov_9fa48("4161");
            dispatch(toogleNotification(stryMutAct_9fa48("4162") ? {} : (stryCov_9fa48("4162"), {
              text: stryMutAct_9fa48("4163") ? `` : (stryCov_9fa48("4163"), `Error to save circle`),
              status: stryMutAct_9fa48("4164") ? "" : (stryCov_9fa48("4164"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4165") ? [] : (stryCov_9fa48("4165"), [error, dispatch]));
    return stryMutAct_9fa48("4166") ? [] : (stryCov_9fa48("4166"), [response, saveCircleManually, isSaving]);
  }
};
export const useSaveCircleWithFile = (circleId: string): [Circle, Function, boolean] => {
  if (stryMutAct_9fa48("4167")) {
    {}
  } else {
    stryCov_9fa48("4167");
    const saveCircleRequest = (stryMutAct_9fa48("4170") ? circleId === NEW_TAB : stryMutAct_9fa48("4169") ? false : stryMutAct_9fa48("4168") ? true : (stryCov_9fa48("4168", "4169", "4170"), circleId !== NEW_TAB)) ? updateCircleWithFile : createCircleWithFile;
    const [circleData, saveCircle] = useFetch<Circle>(saveCircleRequest);
    const {
      response,
      error,
      loading: isSaving
    } = circleData;
    const dispatch = useDispatch();
    const saveCircleWithFile = useCallback((circle: CreateCircleWithFilePayload) => {
      if (stryMutAct_9fa48("4171")) {
        {}
      } else {
        stryCov_9fa48("4171");
        const payload = buildFormData(circle);
        saveCircle(payload, circleId);
      }
    }, stryMutAct_9fa48("4172") ? [] : (stryCov_9fa48("4172"), [saveCircle, circleId]));
    useEffect(() => {
      if (stryMutAct_9fa48("4173")) {
        {}
      } else {
        stryCov_9fa48("4173");

        if (stryMutAct_9fa48("4175") ? false : stryMutAct_9fa48("4174") ? true : (stryCov_9fa48("4174", "4175"), error)) {
          if (stryMutAct_9fa48("4176")) {
            {}
          } else {
            stryCov_9fa48("4176");
            dispatch(toogleNotification(stryMutAct_9fa48("4177") ? {} : (stryCov_9fa48("4177"), {
              text: stryMutAct_9fa48("4178") ? `` : (stryCov_9fa48("4178"), `Error performing upload`),
              status: stryMutAct_9fa48("4179") ? "" : (stryCov_9fa48("4179"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4180") ? [] : (stryCov_9fa48("4180"), [error, dispatch]));
    return stryMutAct_9fa48("4181") ? [] : (stryCov_9fa48("4181"), [response, saveCircleWithFile, isSaving]);
  }
};
export const useCircleUndeploy = (): {
  undeployRelease: Function;
  status: string;
  resetStatus: () => void;
} => {
  if (stryMutAct_9fa48("4182")) {
    {}
  } else {
    stryCov_9fa48("4182");
    const [status, setStatus] = useState(stryMutAct_9fa48("4183") ? "" : (stryCov_9fa48("4183"), 'idle'));
    const [,, makeUndeploy] = useFetch(undeploy);
    const resetStatus = stryMutAct_9fa48("4184") ? () => undefined : (stryCov_9fa48("4184"), (() => {
      const resetStatus = () => setStatus(stryMutAct_9fa48("4185") ? "" : (stryCov_9fa48("4185"), 'idle'));

      return resetStatus;
    })());
    const undeployRelease = useCallback(async (deployment: Deployment) => {
      if (stryMutAct_9fa48("4186")) {
        {}
      } else {
        stryCov_9fa48("4186");

        try {
          if (stryMutAct_9fa48("4187")) {
            {}
          } else {
            stryCov_9fa48("4187");

            if (stryMutAct_9fa48("4189") ? false : stryMutAct_9fa48("4188") ? true : (stryCov_9fa48("4188", "4189"), deployment)) {
              if (stryMutAct_9fa48("4190")) {
                {}
              } else {
                stryCov_9fa48("4190");
                setStatus(stryMutAct_9fa48("4191") ? "" : (stryCov_9fa48("4191"), 'pending'));
                await makeUndeploy(deployment.id);
                setStatus(stryMutAct_9fa48("4192") ? "" : (stryCov_9fa48("4192"), 'resolved'));
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("4193")) {
            {}
          } else {
            stryCov_9fa48("4193");
            setStatus(stryMutAct_9fa48("4194") ? "" : (stryCov_9fa48("4194"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("4195") ? [] : (stryCov_9fa48("4195"), [makeUndeploy]));
    return stryMutAct_9fa48("4196") ? {} : (stryCov_9fa48("4196"), {
      undeployRelease,
      status,
      resetStatus
    });
  }
};
export default useCircles;