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

import { useCallback, useEffect, useState } from 'react';
import { create, removeDeploymentConfiguration, configPath } from 'core/providers/deploymentConfiguration';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { useFetchData, FetchStatuses } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { DeploymentConfiguration, Response } from './interfaces';
export const useCDConfiguration = (): FetchProps => {
  if (stryMutAct_9fa48("5641")) {
    {}
  } else {
    stryCov_9fa48("5641");
    const dispatch = useDispatch();
    const [createData, createCDConfiguration] = useFetch<Response>(create);
    const [addData, addCDConfiguration] = useFetch(addConfig);
    const patchDeploymentConfig = useFetchData(delConfig);
    const removeDeploymentConfig = useFetchData(removeDeploymentConfiguration);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("5642") ? "" : (stryCov_9fa48("5642"), 'idle'));
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
    const save = useCallback((cdConfiguration: DeploymentConfiguration) => {
      if (stryMutAct_9fa48("5643")) {
        {}
      } else {
        stryCov_9fa48("5643");
        createCDConfiguration(cdConfiguration);
      }
    }, stryMutAct_9fa48("5644") ? [] : (stryCov_9fa48("5644"), [createCDConfiguration]));
    useEffect(() => {
      if (stryMutAct_9fa48("5645")) {
        {}
      } else {
        stryCov_9fa48("5645");
        if (stryMutAct_9fa48("5647") ? false : stryMutAct_9fa48("5646") ? true : (stryCov_9fa48("5646", "5647"), responseSave)) addCDConfiguration(configPath, stryMutAct_9fa48("5648") ? responseSave.id : (stryCov_9fa48("5648"), responseSave?.id));
      }
    }, stryMutAct_9fa48("5649") ? [] : (stryCov_9fa48("5649"), [addCDConfiguration, responseSave]));
    useEffect(() => {
      if (stryMutAct_9fa48("5650")) {
        {}
      } else {
        stryCov_9fa48("5650");

        if (stryMutAct_9fa48("5652") ? false : stryMutAct_9fa48("5651") ? true : (stryCov_9fa48("5651", "5652"), errorSave)) {
          if (stryMutAct_9fa48("5653")) {
            {}
          } else {
            stryCov_9fa48("5653");
            dispatch(toogleNotification(stryMutAct_9fa48("5654") ? {} : (stryCov_9fa48("5654"), {
              text: stryMutAct_9fa48("5655") ? `` : (stryCov_9fa48("5655"), `[${errorSave.status}] Deployment Configuration could not be saved.`),
              status: stryMutAct_9fa48("5656") ? "" : (stryCov_9fa48("5656"), 'error')
            })));
          }
        } else if (stryMutAct_9fa48("5658") ? false : stryMutAct_9fa48("5657") ? true : (stryCov_9fa48("5657", "5658"), errorAdd)) {
          if (stryMutAct_9fa48("5659")) {
            {}
          } else {
            stryCov_9fa48("5659");
            dispatch(toogleNotification(stryMutAct_9fa48("5660") ? {} : (stryCov_9fa48("5660"), {
              text: stryMutAct_9fa48("5661") ? `` : (stryCov_9fa48("5661"), `[${errorAdd.status}] Deployment Configuration could not be patched.`),
              status: stryMutAct_9fa48("5662") ? "" : (stryCov_9fa48("5662"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5663") ? [] : (stryCov_9fa48("5663"), [errorSave, errorAdd, dispatch]));
    const remove = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("5664")) {
        {}
      } else {
        stryCov_9fa48("5664");

        try {
          if (stryMutAct_9fa48("5665")) {
            {}
          } else {
            stryCov_9fa48("5665");
            setStatus(stryMutAct_9fa48("5666") ? "" : (stryCov_9fa48("5666"), 'pending'));
            await patchDeploymentConfig(configPath, id);
            removeDeploymentConfig(id);
            dispatch(toogleNotification(stryMutAct_9fa48("5667") ? {} : (stryCov_9fa48("5667"), {
              text: stryMutAct_9fa48("5668") ? "" : (stryCov_9fa48("5668"), 'Success deleting deployment configuration'),
              status: stryMutAct_9fa48("5669") ? "" : (stryCov_9fa48("5669"), 'success')
            })));
            setStatus(stryMutAct_9fa48("5670") ? "" : (stryCov_9fa48("5670"), 'resolved'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("5671")) {
            {}
          } else {
            stryCov_9fa48("5671");
            setStatus(stryMutAct_9fa48("5672") ? "" : (stryCov_9fa48("5672"), 'rejected'));

            (async () => {
              if (stryMutAct_9fa48("5673")) {
                {}
              } else {
                stryCov_9fa48("5673");

                if (stryMutAct_9fa48("5675") ? false : stryMutAct_9fa48("5674") ? true : (stryCov_9fa48("5674", "5675"), e)) {
                  if (stryMutAct_9fa48("5676")) {
                    {}
                  } else {
                    stryCov_9fa48("5676");
                    const error = await e.json();
                    dispatch(toogleNotification(stryMutAct_9fa48("5677") ? {} : (stryCov_9fa48("5677"), {
                      text: stryMutAct_9fa48("5678") ? `` : (stryCov_9fa48("5678"), `${error.status}: ${stryMutAct_9fa48("5679") ? error.message : (stryCov_9fa48("5679"), error?.message)}`),
                      status: stryMutAct_9fa48("5680") ? "" : (stryCov_9fa48("5680"), 'error')
                    })));
                  }
                }
              }
            })();
          }
        }
      }
    }, stryMutAct_9fa48("5681") ? [] : (stryCov_9fa48("5681"), [patchDeploymentConfig, removeDeploymentConfig, dispatch]));
    return stryMutAct_9fa48("5682") ? {} : (stryCov_9fa48("5682"), {
      responseAdd,
      save,
      remove,
      status,
      loadingSave,
      loadingAdd
    });
  }
};