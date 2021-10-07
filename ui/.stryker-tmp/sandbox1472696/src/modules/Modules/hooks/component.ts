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

import { useDispatch } from 'core/state/hooks';
import { useState, useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { createComponent, updateComponent, deleteComponent } from 'core/providers/modules';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Module } from 'modules/Modules/interfaces/Module';
export const useSaveComponent = (): {
  saveComponent: Function;
  response: Module;
  error: Response;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("5380")) {
    {}
  } else {
    stryCov_9fa48("5380");
    const [data, saveComponent] = useFetch<Module>(createComponent);
    const {
      response,
      loading,
      error
    } = data;
    const dispatch = useDispatch();
    useEffect(() => {
      if (stryMutAct_9fa48("5381")) {
        {}
      } else {
        stryCov_9fa48("5381");

        (async () => {
          if (stryMutAct_9fa48("5382")) {
            {}
          } else {
            stryCov_9fa48("5382");

            if (stryMutAct_9fa48("5384") ? false : stryMutAct_9fa48("5383") ? true : (stryCov_9fa48("5383", "5384"), error)) {
              if (stryMutAct_9fa48("5385")) {
                {}
              } else {
                stryCov_9fa48("5385");
                const e = await error.json();
                dispatch(toogleNotification(stryMutAct_9fa48("5386") ? {} : (stryCov_9fa48("5386"), {
                  text: stryMutAct_9fa48("5387") ? `` : (stryCov_9fa48("5387"), `${error.status}: ${stryMutAct_9fa48("5388") ? e.message : (stryCov_9fa48("5388"), e?.message)}`),
                  status: stryMutAct_9fa48("5389") ? "" : (stryCov_9fa48("5389"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("5390") ? [] : (stryCov_9fa48("5390"), [dispatch, error]));
    return stryMutAct_9fa48("5391") ? {} : (stryCov_9fa48("5391"), {
      saveComponent,
      response,
      error,
      loading
    });
  }
};
export const useUpdateComponent = (): {
  updateComponent: Function;
  response: Module;
  error: Response;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("5392")) {
    {}
  } else {
    stryCov_9fa48("5392");
    const [data, update] = useFetch<Module>(updateComponent);
    const {
      response,
      loading,
      error
    } = data;
    const dispatch = useDispatch();
    useEffect(() => {
      if (stryMutAct_9fa48("5393")) {
        {}
      } else {
        stryCov_9fa48("5393");

        (async () => {
          if (stryMutAct_9fa48("5394")) {
            {}
          } else {
            stryCov_9fa48("5394");

            if (stryMutAct_9fa48("5396") ? false : stryMutAct_9fa48("5395") ? true : (stryCov_9fa48("5395", "5396"), error)) {
              if (stryMutAct_9fa48("5397")) {
                {}
              } else {
                stryCov_9fa48("5397");
                const e = await error.json();
                dispatch(toogleNotification(stryMutAct_9fa48("5398") ? {} : (stryCov_9fa48("5398"), {
                  text: stryMutAct_9fa48("5399") ? `` : (stryCov_9fa48("5399"), `${error.status}: ${stryMutAct_9fa48("5400") ? e.message : (stryCov_9fa48("5400"), e?.message)}`),
                  status: stryMutAct_9fa48("5401") ? "" : (stryCov_9fa48("5401"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("5402") ? [] : (stryCov_9fa48("5402"), [dispatch, error]));
    return stryMutAct_9fa48("5403") ? {} : (stryCov_9fa48("5403"), {
      updateComponent: update,
      response,
      error,
      loading
    });
  }
};
export const useDeleteComponent = (): {
  removeComponent: Function;
  status: string;
  error: Response;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("5404")) {
    {}
  } else {
    stryCov_9fa48("5404");
    const [data,, deletePromise] = useFetch<Module>(deleteComponent);
    const [status, setStatus] = useState(stryMutAct_9fa48("5405") ? "Stryker was here!" : (stryCov_9fa48("5405"), ''));
    const {
      loading,
      error
    } = data;
    const dispatch = useDispatch();
    const removeComponent = useCallback((moduleId: string, componentId: string) => {
      if (stryMutAct_9fa48("5406")) {
        {}
      } else {
        stryCov_9fa48("5406");
        setStatus(stryMutAct_9fa48("5407") ? "Stryker was here!" : (stryCov_9fa48("5407"), ''));
        deletePromise(moduleId, componentId).then(stryMutAct_9fa48("5408") ? () => undefined : (stryCov_9fa48("5408"), () => setStatus(stryMutAct_9fa48("5409") ? "" : (stryCov_9fa48("5409"), 'resolved'))));
      }
    }, stryMutAct_9fa48("5410") ? [] : (stryCov_9fa48("5410"), [deletePromise]));
    useEffect(() => {
      if (stryMutAct_9fa48("5411")) {
        {}
      } else {
        stryCov_9fa48("5411");

        (async () => {
          if (stryMutAct_9fa48("5412")) {
            {}
          } else {
            stryCov_9fa48("5412");

            if (stryMutAct_9fa48("5414") ? false : stryMutAct_9fa48("5413") ? true : (stryCov_9fa48("5413", "5414"), error)) {
              if (stryMutAct_9fa48("5415")) {
                {}
              } else {
                stryCov_9fa48("5415");
                const e = await error.json();
                dispatch(toogleNotification(stryMutAct_9fa48("5416") ? {} : (stryCov_9fa48("5416"), {
                  text: stryMutAct_9fa48("5417") ? `` : (stryCov_9fa48("5417"), `${error.status}: ${stryMutAct_9fa48("5418") ? e.message : (stryCov_9fa48("5418"), e?.message)}`),
                  status: stryMutAct_9fa48("5419") ? "" : (stryCov_9fa48("5419"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("5420") ? [] : (stryCov_9fa48("5420"), [dispatch, error]));
    return stryMutAct_9fa48("5421") ? {} : (stryCov_9fa48("5421"), {
      removeComponent,
      status,
      error,
      loading
    });
  }
};