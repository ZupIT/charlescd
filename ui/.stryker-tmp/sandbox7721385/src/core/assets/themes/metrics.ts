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

import { COLOR_DODGER_BLUE, COLOR_MOUNTAIN_MEADOW, COLOR_VIOLET_BLUE, COLOR_ORANGE_PEEL, COLOR_RADICAL_RED, COLOR_SUMMER_SKY, COLOR_RED_ORANGE, COLOR_MAYA_BLUE, COLOR_GOLD, COLOR_CHRISTI, COLOR_MALACHITE, COLOR_BLACK_MARLIN, COLOR_SANTAS_GREY, COLOR_PAYNES_GREY, COLOR_BASTILLE, COLOR_FREE_SPEECH_BLUE, COLOR_WHITE, COLOR_PURPLE_HEART } from 'core/assets/colors';
export const light = {};
export const dark = stryMutAct_9fa48("119") ? {} : (stryCov_9fa48("119"), {
  chart: stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
    Comparison: stryMutAct_9fa48("121") ? [] : (stryCov_9fa48("121"), [COLOR_DODGER_BLUE, COLOR_MOUNTAIN_MEADOW, COLOR_VIOLET_BLUE, COLOR_ORANGE_PEEL, COLOR_RADICAL_RED, COLOR_SUMMER_SKY, COLOR_RED_ORANGE, COLOR_MAYA_BLUE, COLOR_GOLD, COLOR_CHRISTI]),
    error: COLOR_RED_ORANGE,
    latency: COLOR_GOLD,
    requestCircle: COLOR_MALACHITE
  }),
  provider: ({
    success: COLOR_MALACHITE,
    error: COLOR_RED_ORANGE
  } as Record<string, string>),
  health: stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
    cardBackground: COLOR_BLACK_MARLIN,
    cardModules: COLOR_PAYNES_GREY,
    variation: stryMutAct_9fa48("123") ? {} : (stryCov_9fa48("123"), {
      danger: COLOR_RED_ORANGE,
      warning: COLOR_GOLD,
      ok: COLOR_SANTAS_GREY,
      success: COLOR_MALACHITE
    })
  }),
  dashboard: stryMutAct_9fa48("124") ? {} : (stryCov_9fa48("124"), {
    card: COLOR_BASTILLE,
    chart: stryMutAct_9fa48("125") ? {} : (stryCov_9fa48("125"), {
      averageTime: COLOR_MAYA_BLUE,
      deploy: COLOR_MOUNTAIN_MEADOW,
      error: COLOR_RED_ORANGE,
      labels: COLOR_WHITE,
      border: COLOR_PAYNES_GREY
    })
  }),
  circles: ({
    filter: COLOR_BLACK_MARLIN,
    active: COLOR_FREE_SPEECH_BLUE,
    inactive: COLOR_MAYA_BLUE,
    deployed: COLOR_MOUNTAIN_MEADOW,
    deploying: COLOR_DODGER_BLUE,
    error: COLOR_RED_ORANGE,
    undeploying: COLOR_FREE_SPEECH_BLUE,
    notDeployed: COLOR_PURPLE_HEART,
    history: {
      circleRow: {
        background: COLOR_BLACK_MARLIN
      },
      releaseRow: {
        background: COLOR_PAYNES_GREY
      },
      componentRow: {
        background: COLOR_BLACK_MARLIN
      }
    }
  } as Record<string, any>),
  deploy: ({
    deployed: COLOR_MOUNTAIN_MEADOW,
    deploying: COLOR_DODGER_BLUE,
    error: COLOR_RED_ORANGE,
    undeploying: COLOR_FREE_SPEECH_BLUE,
    notDeployed: COLOR_PURPLE_HEART,
    release: {
      releaseRow: {
        background: COLOR_BLACK_MARLIN
      },
      componentRow: {
        background: COLOR_PAYNES_GREY
      }
    }
  } as Record<string, any>)
});