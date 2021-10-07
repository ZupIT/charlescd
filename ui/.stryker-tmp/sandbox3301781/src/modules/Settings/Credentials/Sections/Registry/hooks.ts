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

import { useCallback, useEffect, useState } from 'react';
import { create, configPath, testRegistryConnection, validateConnection } from 'core/providers/registry';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps, ResponseError, useFetchData, useFetchStatus, FetchStatus, FetchStatuses } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Registry, Response } from './interfaces';
type DeleteRegistry = {
  deleteRegistry: () => Promise<Response>;
  status: FetchStatuses;
};
export const useDeleteRegistry = (): DeleteRegistry => {
  if (stryMutAct_9fa48("6011")) {
    {}
  } else {
    stryCov_9fa48("6011");
    const delRegistry = useFetchData(delConfig);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6012") ? "" : (stryCov_9fa48("6012"), "idle"));
    const dispatch = useDispatch();

    const deleteRegistry = async () => {
      if (stryMutAct_9fa48("6013")) {
        {}
      } else {
        stryCov_9fa48("6013");

        try {
          if (stryMutAct_9fa48("6014")) {
            {}
          } else {
            stryCov_9fa48("6014");
            setStatus(stryMutAct_9fa48("6015") ? "" : (stryCov_9fa48("6015"), "pending"));
            const res = await delRegistry(configPath);
            setStatus(stryMutAct_9fa48("6016") ? "" : (stryCov_9fa48("6016"), "resolved"));
            dispatch(toogleNotification(stryMutAct_9fa48("6017") ? {} : (stryCov_9fa48("6017"), {
              text: stryMutAct_9fa48("6018") ? "" : (stryCov_9fa48("6018"), 'Success deleting registry'),
              status: stryMutAct_9fa48("6019") ? "" : (stryCov_9fa48("6019"), 'success')
            })));
            return res;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6020")) {
            {}
          } else {
            stryCov_9fa48("6020");
            setStatus(stryMutAct_9fa48("6021") ? "" : (stryCov_9fa48("6021"), "rejected"));
            dispatch(toogleNotification(stryMutAct_9fa48("6022") ? {} : (stryCov_9fa48("6022"), {
              text: stryMutAct_9fa48("6023") ? `` : (stryCov_9fa48("6023"), `[${e.status}] Registry could not be removed.`),
              status: stryMutAct_9fa48("6024") ? "" : (stryCov_9fa48("6024"), 'error')
            })));
          }
        }
      }
    };

    return stryMutAct_9fa48("6025") ? {} : (stryCov_9fa48("6025"), {
      deleteRegistry,
      status
    });
  }
};
export const useRegistry = (): FetchProps => {
  if (stryMutAct_9fa48("6026")) {
    {}
  } else {
    stryCov_9fa48("6026");
    const dispatch = useDispatch();
    const [createData, createRegistry] = useFetch<Response>(create);
    const [addData, addRegistry] = useFetch(addConfig);
    const [delData, delRegistry] = useFetch(delConfig);
    const {
      loading: loadingSave,
      response: responseSave,
      error: errorSave
    } = createData;
    const {
      loading: loadingAdd,
      response: responseAdd,
      error: errorAdd
    } = addData;
    const {
      response: responseRemove,
      error: errorRemove
    } = delData;
    const save = useCallback((registry: Registry) => {
      if (stryMutAct_9fa48("6027")) {
        {}
      } else {
        stryCov_9fa48("6027");
        createRegistry(registry);
      }
    }, stryMutAct_9fa48("6028") ? [] : (stryCov_9fa48("6028"), [createRegistry]));
    useEffect(() => {
      if (stryMutAct_9fa48("6029")) {
        {}
      } else {
        stryCov_9fa48("6029");
        if (stryMutAct_9fa48("6031") ? false : stryMutAct_9fa48("6030") ? true : (stryCov_9fa48("6030", "6031"), responseSave)) addRegistry(configPath, stryMutAct_9fa48("6032") ? responseSave.id : (stryCov_9fa48("6032"), responseSave?.id));
      }
    }, stryMutAct_9fa48("6033") ? [] : (stryCov_9fa48("6033"), [addRegistry, responseSave]));
    useEffect(() => {
      if (stryMutAct_9fa48("6034")) {
        {}
      } else {
        stryCov_9fa48("6034");

        if (stryMutAct_9fa48("6036") ? false : stryMutAct_9fa48("6035") ? true : (stryCov_9fa48("6035", "6036"), errorSave)) {
          if (stryMutAct_9fa48("6037")) {
            {}
          } else {
            stryCov_9fa48("6037");
            dispatch(toogleNotification(stryMutAct_9fa48("6038") ? {} : (stryCov_9fa48("6038"), {
              text: stryMutAct_9fa48("6039") ? `` : (stryCov_9fa48("6039"), `[${errorSave.status}] Registry could not be saved.`),
              status: stryMutAct_9fa48("6040") ? "" : (stryCov_9fa48("6040"), 'error')
            })));
          }
        } else if (stryMutAct_9fa48("6042") ? false : stryMutAct_9fa48("6041") ? true : (stryCov_9fa48("6041", "6042"), errorAdd)) {
          if (stryMutAct_9fa48("6043")) {
            {}
          } else {
            stryCov_9fa48("6043");
            dispatch(toogleNotification(stryMutAct_9fa48("6044") ? {} : (stryCov_9fa48("6044"), {
              text: stryMutAct_9fa48("6045") ? `` : (stryCov_9fa48("6045"), `[${errorAdd.status}] Registry could not be patched.`),
              status: stryMutAct_9fa48("6046") ? "" : (stryCov_9fa48("6046"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6047") ? [] : (stryCov_9fa48("6047"), [errorSave, errorAdd, dispatch]));
    const remove = useCallback(() => {
      if (stryMutAct_9fa48("6048")) {
        {}
      } else {
        stryCov_9fa48("6048");
        delRegistry(configPath);
      }
    }, stryMutAct_9fa48("6049") ? [] : (stryCov_9fa48("6049"), [delRegistry]));
    useEffect(() => {
      if (stryMutAct_9fa48("6050")) {
        {}
      } else {
        stryCov_9fa48("6050");

        if (stryMutAct_9fa48("6052") ? false : stryMutAct_9fa48("6051") ? true : (stryCov_9fa48("6051", "6052"), errorRemove)) {
          if (stryMutAct_9fa48("6053")) {
            {}
          } else {
            stryCov_9fa48("6053");
            dispatch(toogleNotification(stryMutAct_9fa48("6054") ? {} : (stryCov_9fa48("6054"), {
              text: stryMutAct_9fa48("6055") ? `` : (stryCov_9fa48("6055"), `[${errorRemove.status}] Registry could not be removed.`),
              status: stryMutAct_9fa48("6056") ? "" : (stryCov_9fa48("6056"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6057") ? [] : (stryCov_9fa48("6057"), [errorRemove, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("6058")) {
        {}
      } else {
        stryCov_9fa48("6058");

        if (stryMutAct_9fa48("6060") ? false : stryMutAct_9fa48("6059") ? true : (stryCov_9fa48("6059", "6060"), responseRemove)) {
          if (stryMutAct_9fa48("6061")) {
            {}
          } else {
            stryCov_9fa48("6061");
            dispatch(toogleNotification(stryMutAct_9fa48("6062") ? {} : (stryCov_9fa48("6062"), {
              text: stryMutAct_9fa48("6063") ? "" : (stryCov_9fa48("6063"), 'Success deleting registry'),
              status: stryMutAct_9fa48("6064") ? "" : (stryCov_9fa48("6064"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6065") ? [] : (stryCov_9fa48("6065"), [responseRemove, dispatch]));
    return stryMutAct_9fa48("6066") ? {} : (stryCov_9fa48("6066"), {
      responseAdd,
      save,
      responseRemove,
      remove,
      loadingSave,
      loadingAdd
    });
  }
};
export const useRegistryTestConnection = (): {
  testConnectionRegistry: Function;
  response: Response;
  error: ResponseError;
  status: FetchStatus;
} => {
  if (stryMutAct_9fa48("6067")) {
    {}
  } else {
    stryCov_9fa48("6067");
    const status = useFetchStatus();
    const test = useFetchData<Response>(testRegistryConnection);
    const [response, setResponse] = useState<Response>(null);
    const [error, setError] = useState<ResponseError>(null);
    const testConnectionRegistry = useCallback(async (registry: Registry) => {
      if (stryMutAct_9fa48("6068")) {
        {}
      } else {
        stryCov_9fa48("6068");

        try {
          if (stryMutAct_9fa48("6069")) {
            {}
          } else {
            stryCov_9fa48("6069");

            if (stryMutAct_9fa48("6071") ? false : stryMutAct_9fa48("6070") ? true : (stryCov_9fa48("6070", "6071"), registry)) {
              if (stryMutAct_9fa48("6072")) {
                {}
              } else {
                stryCov_9fa48("6072");
                status.pending();
                const res = await test(registry);
                setResponse(res);
                status.resolved();
                return res;
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("6073")) {
            {}
          } else {
            stryCov_9fa48("6073");
            status.rejected();
            const err = await e.json();
            setResponse(null);
            setError(err);
          }
        }
      }
    }, stryMutAct_9fa48("6074") ? [] : (stryCov_9fa48("6074"), [test, status]));
    return stryMutAct_9fa48("6075") ? {} : (stryCov_9fa48("6075"), {
      testConnectionRegistry,
      response,
      error,
      status
    });
  }
};
export const useRegistryValidateConnection = (): {
  validateConnectionRegistry: Function;
  response: Response;
  error: ResponseError;
} => {
  if (stryMutAct_9fa48("6076")) {
    {}
  } else {
    stryCov_9fa48("6076");
    const test = useFetchData<Response>(validateConnection);
    const [response, setResponse] = useState<Response>(null);
    const [error, setError] = useState<ResponseError>(null);
    const validateConnectionRegistry = useCallback(async (configurationId: string) => {
      if (stryMutAct_9fa48("6077")) {
        {}
      } else {
        stryCov_9fa48("6077");

        try {
          if (stryMutAct_9fa48("6078")) {
            {}
          } else {
            stryCov_9fa48("6078");

            if (stryMutAct_9fa48("6080") ? false : stryMutAct_9fa48("6079") ? true : (stryCov_9fa48("6079", "6080"), configurationId)) {
              if (stryMutAct_9fa48("6081")) {
                {}
              } else {
                stryCov_9fa48("6081");
                const res = await test(configurationId);
                setResponse(res);
                return res;
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("6082")) {
            {}
          } else {
            stryCov_9fa48("6082");
            const err = await e.json();
            setResponse(null);
            setError(err);
          }
        }
      }
    }, stryMutAct_9fa48("6083") ? [] : (stryCov_9fa48("6083"), [test]));
    return stryMutAct_9fa48("6084") ? {} : (stryCov_9fa48("6084"), {
      validateConnectionRegistry,
      response,
      error
    });
  }
};