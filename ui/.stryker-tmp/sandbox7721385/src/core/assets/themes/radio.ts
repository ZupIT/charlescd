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

import { COLOR_SANTAS_GREY, COLOR_BASTILLE, COLOR_PURPLE_HEART, COLOR_WHITE, COLOR_CHETWODE_BLUE, COLOR_JAGUAR } from 'core/assets/colors';
export const light = {};
export const dark = stryMutAct_9fa48("141") ? {} : (stryCov_9fa48("141"), {
  button: stryMutAct_9fa48("142") ? {} : (stryCov_9fa48("142"), {
    checked: stryMutAct_9fa48("143") ? {} : (stryCov_9fa48("143"), {
      background: COLOR_PURPLE_HEART,
      color: COLOR_WHITE
    }),
    unchecked: stryMutAct_9fa48("144") ? {} : (stryCov_9fa48("144"), {
      background: COLOR_BASTILLE,
      color: COLOR_SANTAS_GREY
    })
  }),
  card: stryMutAct_9fa48("145") ? {} : (stryCov_9fa48("145"), {
    checked: stryMutAct_9fa48("146") ? {} : (stryCov_9fa48("146"), {
      background: COLOR_JAGUAR,
      border: COLOR_CHETWODE_BLUE,
      color: COLOR_WHITE,
      checkmark: COLOR_CHETWODE_BLUE
    }),
    unchecked: stryMutAct_9fa48("147") ? {} : (stryCov_9fa48("147"), {
      background: COLOR_BASTILLE,
      border: COLOR_BASTILLE,
      color: COLOR_SANTAS_GREY,
      checkmark: COLOR_SANTAS_GREY
    })
  }),
  default: stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
    checked: stryMutAct_9fa48("149") ? {} : (stryCov_9fa48("149"), {
      background: COLOR_WHITE,
      border: COLOR_CHETWODE_BLUE,
      color: COLOR_WHITE,
      checkmark: COLOR_CHETWODE_BLUE
    }),
    unchecked: stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
      background: COLOR_BASTILLE,
      border: COLOR_CHETWODE_BLUE,
      color: COLOR_SANTAS_GREY,
      checkmark: COLOR_CHETWODE_BLUE
    })
  })
});