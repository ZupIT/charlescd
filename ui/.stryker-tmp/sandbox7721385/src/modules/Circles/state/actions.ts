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

import { CirclePagination } from '../interfaces/CirclesPagination';
import { Circle } from '../interfaces/Circle';
export enum ACTION_TYPES {
  loadedCircles = 'CIRCLES/LOADED_CIRCLES',
  loadedCircle = 'CIRLCES/LOADED_CIRCLE',
  loadedCirclesMetrics = 'CIRCLE/LOADED_CIRCLES_METRICS',
  updateCircles = 'CIRCLES/UPDATE',
  resetContent = 'CIRCLES/RESET_CONTENT',
}
interface LoadedCirclesActionType {
  type: typeof ACTION_TYPES.loadedCircles;
  payload: CirclePagination;
}
interface LoadedCircleActionType {
  type: typeof ACTION_TYPES.loadedCircle;
  payload: Circle;
}
interface LoadedCirclesMetricsActionType {
  type: typeof ACTION_TYPES.loadedCirclesMetrics;
  payload: CirclePagination;
}
interface UpdateCirclesActionType {
  type: typeof ACTION_TYPES.updateCircles;
  payload: Circle[];
}
interface ResetContentActionType {
  type: typeof ACTION_TYPES.resetContent;
}
export const loadedCirclesAction = stryMutAct_9fa48("4197") ? () => undefined : (stryCov_9fa48("4197"), (() => {
  const loadedCirclesAction = (payload: CirclePagination): CirclesActionTypes => stryMutAct_9fa48("4198") ? {} : (stryCov_9fa48("4198"), {
    type: ACTION_TYPES.loadedCircles,
    payload
  });

  return loadedCirclesAction;
})());
export const loadedCircleAction = stryMutAct_9fa48("4199") ? () => undefined : (stryCov_9fa48("4199"), (() => {
  const loadedCircleAction = (payload: Circle): CirclesActionTypes => stryMutAct_9fa48("4200") ? {} : (stryCov_9fa48("4200"), {
    type: ACTION_TYPES.loadedCircle,
    payload
  });

  return loadedCircleAction;
})());
export const loadedCirclesMetricsAction = stryMutAct_9fa48("4201") ? () => undefined : (stryCov_9fa48("4201"), (() => {
  const loadedCirclesMetricsAction = (payload: CirclePagination): CirclesActionTypes => stryMutAct_9fa48("4202") ? {} : (stryCov_9fa48("4202"), {
    type: ACTION_TYPES.loadedCirclesMetrics,
    payload
  });

  return loadedCirclesMetricsAction;
})());
export const updateCirclesAction = stryMutAct_9fa48("4203") ? () => undefined : (stryCov_9fa48("4203"), (() => {
  const updateCirclesAction = (payload: Circle[]): UpdateCirclesActionType => stryMutAct_9fa48("4204") ? {} : (stryCov_9fa48("4204"), {
    type: ACTION_TYPES.updateCircles,
    payload
  });

  return updateCirclesAction;
})());
export const resetContentAction = stryMutAct_9fa48("4205") ? () => undefined : (stryCov_9fa48("4205"), (() => {
  const resetContentAction = (): ResetContentActionType => stryMutAct_9fa48("4206") ? {} : (stryCov_9fa48("4206"), {
    type: ACTION_TYPES.resetContent
  });

  return resetContentAction;
})());
export type CirclesActionTypes = LoadedCirclesActionType | LoadedCircleActionType | LoadedCirclesMetricsActionType | UpdateCirclesActionType | ResetContentActionType;