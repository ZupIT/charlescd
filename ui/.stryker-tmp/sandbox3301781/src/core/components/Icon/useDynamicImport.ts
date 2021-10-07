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

import { useEffect, useState } from 'react';
interface Data {
  default?: string;
}

const useDynamicImport = (name: string) => {
  if (stryMutAct_9fa48("852")) {
    {}
  } else {
    stryCov_9fa48("852");
    const [uri, setUri] = useState(stryMutAct_9fa48("853") ? "Stryker was here!" : (stryCov_9fa48("853"), ''));
    useEffect(() => {
      if (stryMutAct_9fa48("854")) {
        {}
      } else {
        stryCov_9fa48("854");
        let abort: (value: unknown) => void = null;

        (async () => {
          if (stryMutAct_9fa48("855")) {
            {}
          } else {
            stryCov_9fa48("855");
            const abortController = new Promise(resolve => {
              if (stryMutAct_9fa48("856")) {
                {}
              } else {
                stryCov_9fa48("856");
                abort = resolve;
              }
            });
            const svgData = import(stryMutAct_9fa48("857") ? `` : (stryCov_9fa48("857"), `core/assets/svg/${name}.svg`));
            Promise.race(stryMutAct_9fa48("858") ? [] : (stryCov_9fa48("858"), [abortController, svgData])).then((data: Data) => {
              if (stryMutAct_9fa48("859")) {
                {}
              } else {
                stryCov_9fa48("859");

                if (stryMutAct_9fa48("861") ? false : stryMutAct_9fa48("860") ? true : (stryCov_9fa48("860", "861"), data)) {
                  if (stryMutAct_9fa48("862")) {
                    {}
                  } else {
                    stryCov_9fa48("862");
                    setUri(stryMutAct_9fa48("863") ? data.default : (stryCov_9fa48("863"), data?.default));
                  }
                }
              }
            });
          }
        })();

        return stryMutAct_9fa48("864") ? () => undefined : (stryCov_9fa48("864"), () => abort(stryMutAct_9fa48("865") ? "Stryker was here!" : (stryCov_9fa48("865"), '')));
      }
    }, stryMutAct_9fa48("866") ? [] : (stryCov_9fa48("866"), [name, setUri]));
    return stryMutAct_9fa48("867") ? [] : (stryCov_9fa48("867"), [uri]);
  }
};

export default useDynamicImport;