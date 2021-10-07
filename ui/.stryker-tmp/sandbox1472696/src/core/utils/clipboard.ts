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

export const copyToClipboard = (value: string) => {
  if (stryMutAct_9fa48("2086")) {
    {}
  } else {
    stryCov_9fa48("2086");

    if (stryMutAct_9fa48("2088") ? false : stryMutAct_9fa48("2087") ? true : (stryCov_9fa48("2087", "2088"), navigator.clipboard)) {
      if (stryMutAct_9fa48("2089")) {
        {}
      } else {
        stryCov_9fa48("2089");
        navigator.clipboard.writeText(value);
      }
    } else {
      if (stryMutAct_9fa48("2090")) {
        {}
      } else {
        stryCov_9fa48("2090");
        let copyInput = document.createElement(stryMutAct_9fa48("2091") ? "" : (stryCov_9fa48("2091"), "input"));
        copyInput.value = value;
        document.body.appendChild(copyInput);
        copyInput.select();
        document.execCommand(stryMutAct_9fa48("2092") ? "" : (stryCov_9fa48("2092"), "copy"));
        copyInput.remove();
      }
    }
  }
};