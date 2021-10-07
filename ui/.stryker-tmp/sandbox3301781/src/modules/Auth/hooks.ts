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
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { logout } from 'core/utils/auth';
import { codeToTokens } from 'core/providers/auth';
type Grants = { [key in 'access_token' | 'refresh_token']: string };
export const useAuth = (): {
  getTokens: Function;
  grants: Grants;
} => {
  if (stryMutAct_9fa48("2659")) {
    {}
  } else {
    stryCov_9fa48("2659");
    const dispatch = useDispatch();
    const [grants, setGrants] = useState(null);
    const getTokens = useCallback(async (code: string) => {
      if (stryMutAct_9fa48("2660")) {
        {}
      } else {
        stryCov_9fa48("2660");

        try {
          if (stryMutAct_9fa48("2661")) {
            {}
          } else {
            stryCov_9fa48("2661");

            if (stryMutAct_9fa48("2663") ? false : stryMutAct_9fa48("2662") ? true : (stryCov_9fa48("2662", "2663"), code)) {
              if (stryMutAct_9fa48("2664")) {
                {}
              } else {
                stryCov_9fa48("2664");
                const res = await codeToTokens(code);
                res({}).then((response: Response) => {
                  if (stryMutAct_9fa48("2665")) {
                    {}
                  } else {
                    stryCov_9fa48("2665");

                    if (stryMutAct_9fa48("2667") ? false : stryMutAct_9fa48("2666") ? true : (stryCov_9fa48("2666", "2667"), response.ok)) {
                      if (stryMutAct_9fa48("2668")) {
                        {}
                      } else {
                        stryCov_9fa48("2668");
                        response.json().then(json => {
                          if (stryMutAct_9fa48("2669")) {
                            {}
                          } else {
                            stryCov_9fa48("2669");
                            setGrants(json);
                          }
                        });
                      }
                    }
                  }
                });
                return res;
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("2670")) {
            {}
          } else {
            stryCov_9fa48("2670");
            const error = await e.json();

            if (stryMutAct_9fa48("2673") ? error.error !== 'invalid_token' : stryMutAct_9fa48("2672") ? false : stryMutAct_9fa48("2671") ? true : (stryCov_9fa48("2671", "2672", "2673"), error.error === (stryMutAct_9fa48("2674") ? "" : (stryCov_9fa48("2674"), 'invalid_token')))) {
              if (stryMutAct_9fa48("2675")) {
                {}
              } else {
                stryCov_9fa48("2675");
                logout();
              }
            } else {
              if (stryMutAct_9fa48("2676")) {
                {}
              } else {
                stryCov_9fa48("2676");
                dispatch(toogleNotification(stryMutAct_9fa48("2677") ? {} : (stryCov_9fa48("2677"), {
                  text: stryMutAct_9fa48("2678") ? `` : (stryCov_9fa48("2678"), `${error.error} when trying to fetch`),
                  status: stryMutAct_9fa48("2679") ? "" : (stryCov_9fa48("2679"), 'error')
                })));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("2680") ? [] : (stryCov_9fa48("2680"), [dispatch]));
    return stryMutAct_9fa48("2681") ? {} : (stryCov_9fa48("2681"), {
      getTokens,
      grants
    });
  }
};