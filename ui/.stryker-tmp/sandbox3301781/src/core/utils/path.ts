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

import { generatePath } from 'react-router';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import filter from 'lodash/filter';
import { History } from 'history';
import { portLegacyDevelopment } from 'core/utils/development';
import getQueryStrings from 'core/utils/query';
import includes from 'lodash/includes';
import { NEW_TAB } from 'core/components/TabPanel/constants';
export const generatePathV1 = (path: string, params: {
  [paramName: string]: string | number | boolean;
}) => {
  if (stryMutAct_9fa48("2176")) {
    {}
  } else {
    stryCov_9fa48("2176");
    const skipLegacyPort = stryMutAct_9fa48("2177") ? {} : (stryCov_9fa48("2177"), {
      [portLegacyDevelopment]: stryMutAct_9fa48("2178") ? `` : (stryCov_9fa48("2178"), `:${portLegacyDevelopment}`)
    });
    return generatePath(path, stryMutAct_9fa48("2179") ? {} : (stryCov_9fa48("2179"), { ...skipLegacyPort,
      ...params
    }));
  }
};
export const pushTo = (path: string) => {
  if (stryMutAct_9fa48("2180")) {
    {}
  } else {
    stryCov_9fa48("2180");
    window.location.href = path;
  }
};
export const addParam = (paramName: string, route: string, history: History, param: string) => {
  if (stryMutAct_9fa48("2181")) {
    {}
  } else {
    stryCov_9fa48("2181");
    const query = getQueryStrings();
    query.append(paramName, param);
    history.push(stryMutAct_9fa48("2182") ? {} : (stryCov_9fa48("2182"), {
      pathname: route,
      search: query.toString()
    }));
  }
};
export const delParam = (paramName: string, route: string, history: History, param: string) => {
  if (stryMutAct_9fa48("2183")) {
    {}
  } else {
    stryCov_9fa48("2183");
    const query = getQueryStrings();
    const queries = query.getAll(paramName);
    const remaineds = filter(queries, stryMutAct_9fa48("2184") ? () => undefined : (stryCov_9fa48("2184"), q => stryMutAct_9fa48("2185") ? includes(q, param) : (stryCov_9fa48("2185"), !includes(q, param))));
    const params = new URLSearchParams();
    map(remaineds, stryMutAct_9fa48("2186") ? () => undefined : (stryCov_9fa48("2186"), id => params.append(paramName, id)));
    history.push(stryMutAct_9fa48("2187") ? {} : (stryCov_9fa48("2187"), {
      pathname: route,
      search: params.toString()
    }));
  }
};
export const updateParam = (paramName: string, route: string, history: History, oldParam: string, newParam: string) => {
  if (stryMutAct_9fa48("2188")) {
    {}
  } else {
    stryCov_9fa48("2188");
    const query = getQueryStrings();
    const queries = query.getAll(paramName);
    const params = new URLSearchParams();
    map(queries, param => {
      if (stryMutAct_9fa48("2189")) {
        {}
      } else {
        stryCov_9fa48("2189");

        if (stryMutAct_9fa48("2191") ? false : stryMutAct_9fa48("2190") ? true : (stryCov_9fa48("2190", "2191"), includes(param, oldParam))) {
          if (stryMutAct_9fa48("2192")) {
            {}
          } else {
            stryCov_9fa48("2192");
            params.append(paramName, newParam);
          }
        } else {
          if (stryMutAct_9fa48("2193")) {
            {}
          } else {
            stryCov_9fa48("2193");
            params.append(paramName, param);
          }
        }
      }
    });
    history.push(stryMutAct_9fa48("2194") ? {} : (stryCov_9fa48("2194"), {
      pathname: route,
      search: params.toString()
    }));
  }
};
export const updateUntitledParam = (paramName: string, param: string) => {
  if (stryMutAct_9fa48("2195")) {
    {}
  } else {
    stryCov_9fa48("2195");
    const query = getQueryStrings();
    const queries = query.getAll(paramName);
    const params = new URLSearchParams();
    const getParam = stryMutAct_9fa48("2196") ? () => undefined : (stryCov_9fa48("2196"), (() => {
      const getParam = (p: string) => (stryMutAct_9fa48("2199") ? p !== NEW_TAB : stryMutAct_9fa48("2198") ? false : stryMutAct_9fa48("2197") ? true : (stryCov_9fa48("2197", "2198", "2199"), p === NEW_TAB)) ? param : p;

      return getParam;
    })());
    map(queries, stryMutAct_9fa48("2200") ? () => undefined : (stryCov_9fa48("2200"), q => params.append(paramName, getParam(q))));
    window.history.pushState(null, stryMutAct_9fa48("2201") ? "Stryker was here!" : (stryCov_9fa48("2201"), ''), stryMutAct_9fa48("2202") ? `` : (stryCov_9fa48("2202"), `?${params.toString()}`));
  }
};
export const getAllParams = (paramName: string) => {
  if (stryMutAct_9fa48("2203")) {
    {}
  } else {
    stryCov_9fa48("2203");
    const query = getQueryStrings();
    return reverse(query.getAll(paramName));
  }
};
export const isParamExists = (paramName: string, param: string) => {
  if (stryMutAct_9fa48("2204")) {
    {}
  } else {
    stryCov_9fa48("2204");
    const params = getAllParams(paramName);
    return includes(params, param);
  }
};