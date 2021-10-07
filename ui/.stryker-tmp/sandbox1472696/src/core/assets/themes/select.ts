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

import { COLOR_LIGHT_DEFAULT, COLOR_BLACK_RUSSIAN, COLOR_NEON_BLUE, COLOR_BASTILLE, COLOR_WHITE, COLOR_BLACK_MARLIN, COLOR_SANTAS_GREY, COLOR_PURPLE_HEART, COLOR_LAVENDER_GREY } from '../colors';
export const light = {};
export const dark = stryMutAct_9fa48("154") ? {} : (stryCov_9fa48("154"), {
  background: COLOR_BLACK_RUSSIAN,
  color: COLOR_LIGHT_DEFAULT,
  placeholder: COLOR_SANTAS_GREY,
  borderColor: COLOR_WHITE,
  disabled: stryMutAct_9fa48("155") ? {} : (stryCov_9fa48("155"), {
    color: COLOR_SANTAS_GREY,
    borderColor: COLOR_SANTAS_GREY
  }),
  focus: stryMutAct_9fa48("156") ? {} : (stryCov_9fa48("156"), {
    color: COLOR_LIGHT_DEFAULT,
    borderColor: COLOR_NEON_BLUE
  }),
  menu: stryMutAct_9fa48("157") ? {} : (stryCov_9fa48("157"), {
    background: COLOR_BASTILLE,
    color: COLOR_SANTAS_GREY,
    border: COLOR_BASTILLE,
    hover: stryMutAct_9fa48("158") ? {} : (stryCov_9fa48("158"), {
      background: COLOR_BLACK_MARLIN
    })
  }),
  checkbox: stryMutAct_9fa48("159") ? {} : (stryCov_9fa48("159"), {
    checked: stryMutAct_9fa48("160") ? {} : (stryCov_9fa48("160"), {
      background: COLOR_PURPLE_HEART
    }),
    unchecked: stryMutAct_9fa48("161") ? {} : (stryCov_9fa48("161"), {
      background: COLOR_BASTILLE,
      borderColor: COLOR_LAVENDER_GREY
    })
  })
});