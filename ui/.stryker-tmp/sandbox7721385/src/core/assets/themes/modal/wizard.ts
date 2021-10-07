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

import { COLOR_BASTILLE, COLOR_BLACK_MARLIN, COLOR_LIGHT_DEFAULT, COLOR_BLACK_RUSSIAN, COLOR_MOUNTAIN_MEADOW, COLOR_MAYA_BLUE, COLOR_OBSERVATORY, COLOR_GOLD, COLOR_RADICAL_RED, COLOR_PURPLE_HEART, COLOR_ORANGE_PEEL, COLOR_SANTAS_GREY } from 'core/assets/colors';
export const light = {};
export const dark = stryMutAct_9fa48("129") ? {} : (stryCov_9fa48("129"), {
  screen: COLOR_BLACK_RUSSIAN,
  background: ({
    menu: COLOR_BASTILLE,
    info: COLOR_BLACK_MARLIN,
    welcome: COLOR_MAYA_BLUE,
    userGroup: COLOR_OBSERVATORY,
    git: COLOR_GOLD,
    registry: COLOR_RADICAL_RED,
    cdConfig: COLOR_PURPLE_HEART,
    circleMatcher: COLOR_ORANGE_PEEL,
    metricsProvider: COLOR_MOUNTAIN_MEADOW
  } as Record<string, string>),
  button: COLOR_PURPLE_HEART,
  text: stryMutAct_9fa48("130") ? {} : (stryCov_9fa48("130"), {
    active: COLOR_LIGHT_DEFAULT,
    inactive: COLOR_SANTAS_GREY
  })
});