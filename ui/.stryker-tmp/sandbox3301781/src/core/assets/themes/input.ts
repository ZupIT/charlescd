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

import { COLOR_LIGHT_DEFAULT, COLOR_BLACK_RUSSIAN, COLOR_WHITE, COLOR_NEON_BLUE, COLOR_SANTAS_GREY, COLOR_BASTILLE, COLOR_BLACK_MARLIN, COLOR_GHOST_WHITE, COLOR_RED_ORANGE } from '../colors';
export const light = {};
export const dark = stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
  background: COLOR_BLACK_RUSSIAN,
  color: COLOR_LIGHT_DEFAULT,
  label: COLOR_SANTAS_GREY,
  borderColor: COLOR_WHITE,
  disabled: stryMutAct_9fa48("101") ? {} : (stryCov_9fa48("101"), {
    color: COLOR_SANTAS_GREY,
    borderColor: COLOR_SANTAS_GREY
  }),
  focus: stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
    background: COLOR_BLACK_MARLIN,
    borderColor: COLOR_NEON_BLUE
  }),
  search: stryMutAct_9fa48("103") ? {} : (stryCov_9fa48("103"), {
    color: COLOR_SANTAS_GREY,
    focus: stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
      color: COLOR_LIGHT_DEFAULT
    })
  }),
  group: stryMutAct_9fa48("105") ? {} : (stryCov_9fa48("105"), {
    prepend: stryMutAct_9fa48("106") ? {} : (stryCov_9fa48("106"), {
      background: COLOR_BLACK_MARLIN
    }),
    append: stryMutAct_9fa48("107") ? {} : (stryCov_9fa48("107"), {
      background: COLOR_BLACK_MARLIN
    }),
    input: stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
      color: COLOR_GHOST_WHITE,
      background: COLOR_BASTILLE
    })
  }),
  title: stryMutAct_9fa48("109") ? {} : (stryCov_9fa48("109"), {
    background: COLOR_BASTILLE
  }),
  copy: stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
    background: COLOR_BASTILLE
  }),
  error: stryMutAct_9fa48("111") ? {} : (stryCov_9fa48("111"), {
    borderColor: COLOR_RED_ORANGE,
    color: COLOR_RED_ORANGE
  }),
  action: stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
    background: COLOR_BLACK_MARLIN
  })
});