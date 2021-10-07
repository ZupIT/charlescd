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

import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
const getQueryStrings = stryMutAct_9fa48("2212") ? () => undefined : (stryCov_9fa48("2212"), (() => {
  const getQueryStrings = () => new URLSearchParams(window.location.search);

  return getQueryStrings;
})());
export type URLParams = {
  [key: string]: boolean | string | number | string[] | number[];
};
export const buildParams = (data: URLParams) => {
  if (stryMutAct_9fa48("2213")) {
    {}
  } else {
    stryCov_9fa48("2213");
    const params = new URLSearchParams();
    forEach(data, (value, key) => {
      if (stryMutAct_9fa48("2214")) {
        {}
      } else {
        stryCov_9fa48("2214");

        if (stryMutAct_9fa48("2216") ? false : stryMutAct_9fa48("2215") ? true : (stryCov_9fa48("2215", "2216"), Array.isArray(data[key]))) {
          if (stryMutAct_9fa48("2217")) {
            {}
          } else {
            stryCov_9fa48("2217");
            forEach((value as []), (item: string) => {
              if (stryMutAct_9fa48("2218")) {
                {}
              } else {
                stryCov_9fa48("2218");

                if (stryMutAct_9fa48("2221") ? false : stryMutAct_9fa48("2220") ? true : stryMutAct_9fa48("2219") ? isEmpty(item?.toString()) : (stryCov_9fa48("2219", "2220", "2221"), !isEmpty(stryMutAct_9fa48("2222") ? item.toString() : (stryCov_9fa48("2222"), item?.toString())))) {
                  if (stryMutAct_9fa48("2223")) {
                    {}
                  } else {
                    stryCov_9fa48("2223");
                    params.append(key, item);
                  }
                }
              }
            });
          }
        } else if (stryMutAct_9fa48("2226") ? false : stryMutAct_9fa48("2225") ? true : stryMutAct_9fa48("2224") ? isEmpty(value?.toString()) : (stryCov_9fa48("2224", "2225", "2226"), !isEmpty(stryMutAct_9fa48("2227") ? value.toString() : (stryCov_9fa48("2227"), value?.toString())))) {
          if (stryMutAct_9fa48("2228")) {
            {}
          } else {
            stryCov_9fa48("2228");
            params.append(key, (value as string));
          }
        }
      }
    });
    return params;
  }
};
export default getQueryStrings;