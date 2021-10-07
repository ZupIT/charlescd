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

export const COLOR_WHITE = stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), '#FFF');
export const COLOR_SANTAS_GREY = stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), '#98989E');
export const COLOR_PAYNES_GREY = stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), '#48484A');
export const COLOR_BLACK_RUSSIAN = stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), '#1C1C1E');
export const COLOR_GHOST_WHITE = stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), 'rgb(244, 244, 250)');
export const COLOR_RED_ORANGE = stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), 'rgb(255, 69, 58)'); // #FF453A

export const COLOR_GOLD = stryMutAct_9fa48("16") ? "" : (stryCov_9fa48("16"), '#FFD60A');
export const COLOR_SUNFLOWER = stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), '#E1BD0A');
export const COLOR_CHETWODE_BLUE = stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), '#5C6BC0');
export const COLOR_NEON_BLUE = stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), '#4E5FFF');
export const COLOR_FREE_SPEECH_BLUE = stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), '#3945D8');
export const COLOR_PURPLE_HEART = stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), '#5C37CC');
export const COLOR_MALACHITE = stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), '#30D158');
export const COLOR_LAVENDER_GREY = stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), '#C7C7D4');
export const COLOR_DODGER_BLUE = stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), '#0A84FF');
export const COLOR_BLACK_MARLIN = stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), '#3A3A3C');
export const COLOR_BASTILLE = stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'rgb(44, 44, 46)'); // #2C2C2E

export const COLOR_JAGUAR = stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), '#202031');
export const COLOR_BLACK_OP_20 = stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), 'rgba(0, 0, 0, 0.2)');
export const COLOR_LIGHT_DEFAULT = stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), '#F2F2F9');
export const COLOR_MOUNTAIN_MEADOW = stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), '#10AA80');
export const COLOR_OBSERVATORY = stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), '#0A936D');
export const COLOR_VIOLET_BLUE = stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), '#9D40FF');
export const COLOR_ORANGE_PEEL = stryMutAct_9fa48("33") ? "" : (stryCov_9fa48("33"), '#FF9F0A');
export const COLOR_RADICAL_RED = stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), '#FF375F');
export const COLOR_SUMMER_SKY = stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), '#4DB0E9');
export const COLOR_MAYA_BLUE = stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), '#64D2FF');
export const COLOR_CHRISTI = stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), '#62B605');
export const COLOR_GETTING_DARKER = stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), '#979797');
export const COLOR_TRUE_V = stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), '#9579c6');
export const COLOR_COMET = stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), '#636366');