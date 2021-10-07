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

import { useState, useCallback } from 'react';
import { useFetch, useFetchData } from 'core/providers/base/hooks';
import { login, circleMatcher } from 'core/providers/auth';
import { saveSessionData } from 'core/utils/auth';
import { saveCircleId } from 'core/utils/circle';
import { useUser } from 'modules/Users/hooks';
import { saveProfile } from 'core/utils/profile';
interface CircleMatcherResponse {
  circles: {
    id: string;
  }[];
}
export const useCircleMatcher = (): {
  getCircleId: Function;
} => {
  if (stryMutAct_9fa48("2624")) {
    {}
  } else {
    stryCov_9fa48("2624");
    const getCircleMatcher = useFetchData<CircleMatcherResponse>(circleMatcher);
    const getCircleId = useCallback(async (data: unknown) => {
      if (stryMutAct_9fa48("2625")) {
        {}
      } else {
        stryCov_9fa48("2625");

        try {
          if (stryMutAct_9fa48("2626")) {
            {}
          } else {
            stryCov_9fa48("2626");
            const response = await getCircleMatcher(data);

            if (stryMutAct_9fa48("2628") ? false : stryMutAct_9fa48("2627") ? true : (stryCov_9fa48("2627", "2628"), response)) {
              if (stryMutAct_9fa48("2629")) {
                {}
              } else {
                stryCov_9fa48("2629");
                const [circle] = stryMutAct_9fa48("2630") ? response.circles : (stryCov_9fa48("2630"), response?.circles);
                saveCircleId(stryMutAct_9fa48("2631") ? circle.id : (stryCov_9fa48("2631"), circle?.id));
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("2632")) {
            {}
          } else {
            stryCov_9fa48("2632");
            console.info(stryMutAct_9fa48("2633") ? "" : (stryCov_9fa48("2633"), 'No circle was detected for this user'));
          }
        }
      }
    }, stryMutAct_9fa48("2634") ? [] : (stryCov_9fa48("2634"), [getCircleMatcher]));
    return stryMutAct_9fa48("2635") ? {} : (stryCov_9fa48("2635"), {
      getCircleId
    });
  }
};
interface AuthResponse {
  access_token: string;
  refresh_token: string;
}
export const useLogin = (): {
  doLogin: Function;
  status: string;
  error: string;
} => {
  if (stryMutAct_9fa48("2636")) {
    {}
  } else {
    stryCov_9fa48("2636");
    const [,, getSession] = useFetch<AuthResponse>(login);
    const {
      getCircleId
    } = useCircleMatcher();
    const {
      findByEmail
    } = useUser();
    const [status, setStatus] = useState(stryMutAct_9fa48("2637") ? "Stryker was here!" : (stryCov_9fa48("2637"), ''));
    const [error, setError] = useState(stryMutAct_9fa48("2638") ? "Stryker was here!" : (stryCov_9fa48("2638"), ''));
    const doLogin = useCallback(async (email: string, password: string) => {
      if (stryMutAct_9fa48("2639")) {
        {}
      } else {
        stryCov_9fa48("2639");
        setStatus(stryMutAct_9fa48("2640") ? "" : (stryCov_9fa48("2640"), 'pending'));
        setError(stryMutAct_9fa48("2641") ? "Stryker was here!" : (stryCov_9fa48("2641"), ''));

        try {
          if (stryMutAct_9fa48("2642")) {
            {}
          } else {
            stryCov_9fa48("2642");
            const response: AuthResponse = await getSession(email, password);
            saveSessionData(response[stryMutAct_9fa48("2643") ? "" : (stryCov_9fa48("2643"), 'access_token')], response[stryMutAct_9fa48("2644") ? "" : (stryCov_9fa48("2644"), 'refresh_token')]);
            await getCircleId(stryMutAct_9fa48("2645") ? {} : (stryCov_9fa48("2645"), {
              username: email
            }));
            const user = await findByEmail(email);

            if (stryMutAct_9fa48("2647") ? false : stryMutAct_9fa48("2646") ? true : (stryCov_9fa48("2646", "2647"), user)) {
              if (stryMutAct_9fa48("2648")) {
                {}
              } else {
                stryCov_9fa48("2648");
                saveProfile(stryMutAct_9fa48("2649") ? {} : (stryCov_9fa48("2649"), { ...user
                }));
                setStatus(stryMutAct_9fa48("2650") ? "" : (stryCov_9fa48("2650"), 'resolved'));
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("2651")) {
            {}
          } else {
            stryCov_9fa48("2651");
            const errorMessage = stryMutAct_9fa48("2654") ? e.message && `${e.status}: ${e.statusText}` : stryMutAct_9fa48("2653") ? false : stryMutAct_9fa48("2652") ? true : (stryCov_9fa48("2652", "2653", "2654"), e.message || (stryMutAct_9fa48("2655") ? `` : (stryCov_9fa48("2655"), `${e.status}: ${e.statusText}`)));
            setError(errorMessage);
            setStatus(stryMutAct_9fa48("2656") ? "" : (stryCov_9fa48("2656"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("2657") ? [] : (stryCov_9fa48("2657"), [getSession, getCircleId, findByEmail]));
    return stryMutAct_9fa48("2658") ? {} : (stryCov_9fa48("2658"), {
      doLogin,
      status,
      error
    });
  }
};