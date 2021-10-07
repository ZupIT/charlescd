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

import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import forEach from 'lodash/forEach';
import replace from 'lodash/replace';
import toString from 'lodash/toString';

const replaceRoute = (path: string, pathParams: string[], params: (string | number)[]) => {
  if (stryMutAct_9fa48("2233")) {
    {}
  } else {
    stryCov_9fa48("2233");
    let newPath = path;
    forEach(params, (param, index) => {
      if (stryMutAct_9fa48("2234")) {
        {}
      } else {
        stryCov_9fa48("2234");
        newPath = replace(newPath, pathParams[index], toString(params[index]));
      }
    });
    return newPath;
  }
};

const getPath = (path = stryMutAct_9fa48("2235") ? "Stryker was here!" : (stryCov_9fa48("2235"), ''), params: (string | number)[] = stryMutAct_9fa48("2236") ? ["Stryker was here"] : (stryCov_9fa48("2236"), [])): string => {
  if (stryMutAct_9fa48("2237")) {
    {}
  } else {
    stryCov_9fa48("2237");
    const pathParams = path.match(stryMutAct_9fa48("2240") ? /:+\W*/gi : stryMutAct_9fa48("2239") ? /:+\w/gi : stryMutAct_9fa48("2238") ? /:\w*/gi : (stryCov_9fa48("2238", "2239", "2240"), /:+\w*/gi));

    if (stryMutAct_9fa48("2243") ? pathParams !== null : stryMutAct_9fa48("2242") ? false : stryMutAct_9fa48("2241") ? true : (stryCov_9fa48("2241", "2242", "2243"), pathParams === null)) {
      if (stryMutAct_9fa48("2244")) {
        {}
      } else {
        stryCov_9fa48("2244");
        return path;
      }
    }

    if (stryMutAct_9fa48("2247") ? pathParams.length === params.length : stryMutAct_9fa48("2246") ? false : stryMutAct_9fa48("2245") ? true : (stryCov_9fa48("2245", "2246", "2247"), pathParams.length !== params.length)) {
      if (stryMutAct_9fa48("2248")) {
        {}
      } else {
        stryCov_9fa48("2248");
        return path;
      }
    }

    return replaceRoute(path, pathParams, params);
  }
};

const useRouter = () => {
  if (stryMutAct_9fa48("2249")) {
    {}
  } else {
    stryCov_9fa48("2249");
    const navigate = useHistory();
    return stryMutAct_9fa48("2250") ? {} : (stryCov_9fa48("2250"), {
      push: stryMutAct_9fa48("2251") ? () => undefined : (stryCov_9fa48("2251"), (path: string, ...args: (string | number)[]) => navigate.push(getPath(path, args))),
      goBack: stryMutAct_9fa48("2252") ? () => undefined : (stryCov_9fa48("2252"), () => navigate.goBack()),
      replace: stryMutAct_9fa48("2253") ? () => undefined : (stryCov_9fa48("2253"), (path: string, ...args: (string | number)[]) => navigate.replace(getPath(path, args))),
      go: stryMutAct_9fa48("2254") ? () => undefined : (stryCov_9fa48("2254"), (index: number) => navigate.go(index))
    });
  }
};

const goTo = (path: string) => {
  if (stryMutAct_9fa48("2255")) {
    {}
  } else {
    stryCov_9fa48("2255");
    window.open(path, stryMutAct_9fa48("2256") ? "" : (stryCov_9fa48("2256"), '_blank'));
  }
};

const redirectTo = (path: string) => {
  if (stryMutAct_9fa48("2257")) {
    {}
  } else {
    stryCov_9fa48("2257");
    const {
      location
    } = window;
    location.href = path;
  }
};

const getParamByHash = (param: string) => {
  if (stryMutAct_9fa48("2258")) {
    {}
  } else {
    stryCov_9fa48("2258");
    const path = new URLSearchParams(window.location.hash.replace(stryMutAct_9fa48("2259") ? "" : (stryCov_9fa48("2259"), '#'), stryMutAct_9fa48("2260") ? "" : (stryCov_9fa48("2260"), '?')));
    return path.get(param);
  }
};

const getParam = (param: string) => {
  if (stryMutAct_9fa48("2261")) {
    {}
  } else {
    stryCov_9fa48("2261");
    const path = new URLSearchParams(window.location.href);
    return path.get(param);
  }
};

export { useRouter, useLocation, useParams, useRouteMatch, getPath, replaceRoute, goTo, redirectTo, getParam, getParamByHash };