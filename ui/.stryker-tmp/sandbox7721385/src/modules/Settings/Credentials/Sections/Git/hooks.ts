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

import { useCallback, useEffect } from 'react';
import { create, configPath } from 'core/providers/git';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { GitFormData, Response } from './interfaces';
import { toogleNotification } from 'core/components/Notification/state/actions';
export const useGit = (): FetchProps => {
  if (stryMutAct_9fa48("5705")) {
    {}
  } else {
    stryCov_9fa48("5705");
    const dispatch = useDispatch();
    const [createData, createGit] = useFetch<Response>(create);
    const [addData, addGit] = useFetch(addConfig);
    const [delData, delGit] = useFetch(delConfig);
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
      loading: loadingRemove,
      response: responseRemove,
      error: errorRemove
    } = delData;
    const save = useCallback((git: GitFormData) => {
      if (stryMutAct_9fa48("5706")) {
        {}
      } else {
        stryCov_9fa48("5706");
        createGit(git);
      }
    }, stryMutAct_9fa48("5707") ? [] : (stryCov_9fa48("5707"), [createGit]));
    useEffect(() => {
      if (stryMutAct_9fa48("5708")) {
        {}
      } else {
        stryCov_9fa48("5708");
        if (stryMutAct_9fa48("5710") ? false : stryMutAct_9fa48("5709") ? true : (stryCov_9fa48("5709", "5710"), responseSave)) addGit(configPath, stryMutAct_9fa48("5711") ? responseSave.id : (stryCov_9fa48("5711"), responseSave?.id));
      }
    }, stryMutAct_9fa48("5712") ? [] : (stryCov_9fa48("5712"), [addGit, responseSave]));
    useEffect(() => {
      if (stryMutAct_9fa48("5713")) {
        {}
      } else {
        stryCov_9fa48("5713");

        if (stryMutAct_9fa48("5715") ? false : stryMutAct_9fa48("5714") ? true : (stryCov_9fa48("5714", "5715"), errorSave)) {
          if (stryMutAct_9fa48("5716")) {
            {}
          } else {
            stryCov_9fa48("5716");

            (async () => {
              if (stryMutAct_9fa48("5717")) {
                {}
              } else {
                stryCov_9fa48("5717");
                const e = await errorSave.json();
                dispatch(toogleNotification(stryMutAct_9fa48("5718") ? {} : (stryCov_9fa48("5718"), {
                  text: stryMutAct_9fa48("5719") ? e.message : (stryCov_9fa48("5719"), e?.message),
                  status: stryMutAct_9fa48("5720") ? "" : (stryCov_9fa48("5720"), 'error')
                })));
              }
            })();
          }
        } else if (stryMutAct_9fa48("5722") ? false : stryMutAct_9fa48("5721") ? true : (stryCov_9fa48("5721", "5722"), errorAdd)) {
          if (stryMutAct_9fa48("5723")) {
            {}
          } else {
            stryCov_9fa48("5723");

            (async () => {
              if (stryMutAct_9fa48("5724")) {
                {}
              } else {
                stryCov_9fa48("5724");
                const e = await errorAdd.json();
                dispatch(toogleNotification(stryMutAct_9fa48("5725") ? {} : (stryCov_9fa48("5725"), {
                  text: stryMutAct_9fa48("5726") ? e.message : (stryCov_9fa48("5726"), e?.message),
                  status: stryMutAct_9fa48("5727") ? "" : (stryCov_9fa48("5727"), 'error')
                })));
              }
            })();
          }
        }
      }
    }, stryMutAct_9fa48("5728") ? [] : (stryCov_9fa48("5728"), [errorSave, errorAdd, dispatch]));
    const remove = useCallback(() => {
      if (stryMutAct_9fa48("5729")) {
        {}
      } else {
        stryCov_9fa48("5729");
        delGit(configPath);
      }
    }, stryMutAct_9fa48("5730") ? [] : (stryCov_9fa48("5730"), [delGit]));
    useEffect(() => {
      if (stryMutAct_9fa48("5731")) {
        {}
      } else {
        stryCov_9fa48("5731");

        if (stryMutAct_9fa48("5733") ? false : stryMutAct_9fa48("5732") ? true : (stryCov_9fa48("5732", "5733"), errorRemove)) {
          if (stryMutAct_9fa48("5734")) {
            {}
          } else {
            stryCov_9fa48("5734");
            dispatch(toogleNotification(stryMutAct_9fa48("5735") ? {} : (stryCov_9fa48("5735"), {
              text: stryMutAct_9fa48("5736") ? `` : (stryCov_9fa48("5736"), `[${errorRemove.status}] Git could not be removed.`),
              status: stryMutAct_9fa48("5737") ? "" : (stryCov_9fa48("5737"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("5738") ? [] : (stryCov_9fa48("5738"), [errorRemove, dispatch]));
    return stryMutAct_9fa48("5739") ? {} : (stryCov_9fa48("5739"), {
      responseAdd,
      save,
      responseRemove,
      remove,
      loadingSave,
      loadingAdd,
      loadingRemove
    });
  }
};