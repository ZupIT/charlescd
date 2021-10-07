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
import { useFetch, FetchProps, useFetchData, FetchStatuses } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { Datasource, Plugin, Response } from './interfaces';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { getAllDatasources, createDatasource as create, deleteDatasource, getAllPlugins } from 'core/providers/datasources';
type DeleteDatasource = {
  removeDatasource: (id: string) => Promise<Response>;
  status: FetchStatuses;
};
export const useDeleteDatasource = (): DeleteDatasource => {
  if (stryMutAct_9fa48("5916")) {
    {}
  } else {
    stryCov_9fa48("5916");
    const delDatasource = useFetchData<Response>(deleteDatasource);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("5917") ? "" : (stryCov_9fa48("5917"), "idle"));
    const dispatch = useDispatch();

    const removeDatasource = async (id: string) => {
      if (stryMutAct_9fa48("5918")) {
        {}
      } else {
        stryCov_9fa48("5918");

        try {
          if (stryMutAct_9fa48("5919")) {
            {}
          } else {
            stryCov_9fa48("5919");
            setStatus(stryMutAct_9fa48("5920") ? "" : (stryCov_9fa48("5920"), "pending"));
            const res = await delDatasource(id);
            setStatus(stryMutAct_9fa48("5921") ? "" : (stryCov_9fa48("5921"), "resolved"));
            dispatch(toogleNotification(stryMutAct_9fa48("5922") ? {} : (stryCov_9fa48("5922"), {
              text: stryMutAct_9fa48("5923") ? "" : (stryCov_9fa48("5923"), 'Success deleting Datasources'),
              status: stryMutAct_9fa48("5924") ? "" : (stryCov_9fa48("5924"), 'success')
            })));
            return res;
          }
        } catch (e) {
          if (stryMutAct_9fa48("5925")) {
            {}
          } else {
            stryCov_9fa48("5925");
            setStatus(stryMutAct_9fa48("5926") ? "" : (stryCov_9fa48("5926"), "rejected"));
            dispatch(toogleNotification(stryMutAct_9fa48("5927") ? {} : (stryCov_9fa48("5927"), {
              text: stryMutAct_9fa48("5928") ? `` : (stryCov_9fa48("5928"), `[${e.status}] Datasource could not be removed.`),
              status: stryMutAct_9fa48("5929") ? "" : (stryCov_9fa48("5929"), 'error')
            })));
          }
        }
      }
    };

    return stryMutAct_9fa48("5930") ? {} : (stryCov_9fa48("5930"), {
      removeDatasource,
      status
    });
  }
};
export const useDatasource = (): FetchProps => {
  if (stryMutAct_9fa48("5931")) {
    {}
  } else {
    stryCov_9fa48("5931");
    const dispatch = useDispatch();
    const [createData, createDatasource] = useFetch<Response>(create);
    const [datasourceData, getDatasources] = useFetch<Datasource[]>(getAllDatasources);
    const [delData, delDatasource] = useFetch(deleteDatasource);
    const {
      loading: loadingSave,
      response: responseSave,
      error: errorSave
    } = createData;
    const {
      loading: loadingAdd,
      response: responseAdd
    } = delData;
    const {
      response,
      error
    } = datasourceData;
    const {
      response: responseRemove,
      error: errorRemove
    } = delData;
    const save = useCallback((datasource: Datasource) => {
      if (stryMutAct_9fa48("5932")) {
        {}
      } else {
        stryCov_9fa48("5932");
        createDatasource(datasource);
      }
    }, stryMutAct_9fa48("5933") ? [] : (stryCov_9fa48("5933"), [createDatasource]));
    useEffect(() => {
      if (stryMutAct_9fa48("5934")) {
        {}
      } else {
        stryCov_9fa48("5934");

        if (stryMutAct_9fa48("5936") ? false : stryMutAct_9fa48("5935") ? true : (stryCov_9fa48("5935", "5936"), errorSave)) {
          if (stryMutAct_9fa48("5937")) {
            {}
          } else {
            stryCov_9fa48("5937");
            dispatch(toogleNotification(stryMutAct_9fa48("5938") ? {} : (stryCov_9fa48("5938"), {
              text: stryMutAct_9fa48("5939") ? `` : (stryCov_9fa48("5939"), `[${errorSave.status}] Datasource could not be saved.`),
              status: stryMutAct_9fa48("5940") ? "" : (stryCov_9fa48("5940"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5941") ? [] : (stryCov_9fa48("5941"), [errorSave, dispatch]));
    const getAll = useCallback(() => {
      if (stryMutAct_9fa48("5942")) {
        {}
      } else {
        stryCov_9fa48("5942");
        getDatasources();
      }
    }, stryMutAct_9fa48("5943") ? [] : (stryCov_9fa48("5943"), [getDatasources]));
    useEffect(() => {
      if (stryMutAct_9fa48("5944")) {
        {}
      } else {
        stryCov_9fa48("5944");

        if (stryMutAct_9fa48("5946") ? false : stryMutAct_9fa48("5945") ? true : (stryCov_9fa48("5945", "5946"), error)) {
          if (stryMutAct_9fa48("5947")) {
            {}
          } else {
            stryCov_9fa48("5947");
            dispatch(toogleNotification(stryMutAct_9fa48("5948") ? {} : (stryCov_9fa48("5948"), {
              text: stryMutAct_9fa48("5949") ? `` : (stryCov_9fa48("5949"), `[${error.status}] Dat could not be fetched.`),
              status: stryMutAct_9fa48("5950") ? "" : (stryCov_9fa48("5950"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5951") ? [] : (stryCov_9fa48("5951"), [error, dispatch]));
    const remove = useCallback((id: string) => {
      if (stryMutAct_9fa48("5952")) {
        {}
      } else {
        stryCov_9fa48("5952");
        delDatasource(id);
      }
    }, stryMutAct_9fa48("5953") ? [] : (stryCov_9fa48("5953"), [delDatasource]));
    useEffect(() => {
      if (stryMutAct_9fa48("5954")) {
        {}
      } else {
        stryCov_9fa48("5954");

        if (stryMutAct_9fa48("5956") ? false : stryMutAct_9fa48("5955") ? true : (stryCov_9fa48("5955", "5956"), errorRemove)) {
          if (stryMutAct_9fa48("5957")) {
            {}
          } else {
            stryCov_9fa48("5957");
            dispatch(toogleNotification(stryMutAct_9fa48("5958") ? {} : (stryCov_9fa48("5958"), {
              text: stryMutAct_9fa48("5959") ? `` : (stryCov_9fa48("5959"), `[${errorRemove.status}] Datasource could not be removed.`),
              status: stryMutAct_9fa48("5960") ? "" : (stryCov_9fa48("5960"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5961") ? [] : (stryCov_9fa48("5961"), [errorRemove, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("5962")) {
        {}
      } else {
        stryCov_9fa48("5962");

        if (stryMutAct_9fa48("5964") ? false : stryMutAct_9fa48("5963") ? true : (stryCov_9fa48("5963", "5964"), responseRemove)) {
          if (stryMutAct_9fa48("5965")) {
            {}
          } else {
            stryCov_9fa48("5965");
            dispatch(toogleNotification(stryMutAct_9fa48("5966") ? {} : (stryCov_9fa48("5966"), {
              text: stryMutAct_9fa48("5967") ? "" : (stryCov_9fa48("5967"), 'Success deleting Datasources'),
              status: stryMutAct_9fa48("5968") ? "" : (stryCov_9fa48("5968"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5969") ? [] : (stryCov_9fa48("5969"), [responseRemove, dispatch]));
    return stryMutAct_9fa48("5970") ? {} : (stryCov_9fa48("5970"), {
      getAll,
      save,
      remove,
      responseAll: response,
      responseAdd,
      responseRemove,
      loadingSave,
      responseSave,
      loadingAdd
    });
  }
};
export const usePlugins = (): FetchProps => {
  if (stryMutAct_9fa48("5971")) {
    {}
  } else {
    stryCov_9fa48("5971");
    const [allPlugins, getPlugins] = useFetch<Plugin[]>(getAllPlugins);
    const {
      response,
      loading
    } = allPlugins;
    const getAll = useCallback(() => {
      if (stryMutAct_9fa48("5972")) {
        {}
      } else {
        stryCov_9fa48("5972");
        getPlugins();
      }
    }, stryMutAct_9fa48("5973") ? [] : (stryCov_9fa48("5973"), [getPlugins]));
    return stryMutAct_9fa48("5974") ? {} : (stryCov_9fa48("5974"), {
      getAll,
      response,
      loading
    });
  }
};