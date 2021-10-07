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

import { useEffect } from 'react';

const useOutsideClick = (ref: React.MutableRefObject<HTMLElement>, callback: () => void) => {
  if (stryMutAct_9fa48("1243")) {
    {}
  } else {
    stryCov_9fa48("1243");

    const handleClick = (e: MouseEvent) => {
      if (stryMutAct_9fa48("1244")) {
        {}
      } else {
        stryCov_9fa48("1244");

        if (stryMutAct_9fa48("1247") ? ref.current || !ref.current.contains((e.target as Node)) : stryMutAct_9fa48("1246") ? false : stryMutAct_9fa48("1245") ? true : (stryCov_9fa48("1245", "1246", "1247"), ref.current && (stryMutAct_9fa48("1248") ? ref.current.contains((e.target as Node)) : (stryCov_9fa48("1248"), !ref.current.contains((e.target as Node)))))) {
          if (stryMutAct_9fa48("1249")) {
            {}
          } else {
            stryCov_9fa48("1249");
            callback();
          }
        }
      }
    };

    useEffect(() => {
      if (stryMutAct_9fa48("1250")) {
        {}
      } else {
        stryCov_9fa48("1250");
        document.addEventListener(stryMutAct_9fa48("1251") ? "" : (stryCov_9fa48("1251"), 'click'), handleClick);
        return () => {
          if (stryMutAct_9fa48("1252")) {
            {}
          } else {
            stryCov_9fa48("1252");
            document.removeEventListener(stryMutAct_9fa48("1253") ? "" : (stryCov_9fa48("1253"), 'click'), handleClick);
          }
        };
      }
    });
  }
};

export default useOutsideClick;