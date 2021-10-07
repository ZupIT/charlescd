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

import { Module } from '../interfaces/Module';
import { Component } from '../interfaces/Component';
import { ModulePagination } from '../interfaces/ModulePagination';
export enum ACTION_TYPES {
  loadModules = 'MODULES/LIST',
  loadModule = 'MODULES/GET',
  loadComponent = 'MODULES/ADD_COMPONENT',
  resetModule = 'MODULE/RESET',
  resetModules = 'MODULES/RESET',
}
interface LoadModulesActionType {
  type: typeof ACTION_TYPES.loadModules;
  payload: ModulePagination;
}
interface LoadModuleActionType {
  type: typeof ACTION_TYPES.loadModule;
  payload: Module;
}
interface LoadComponentActionType {
  type: typeof ACTION_TYPES.loadComponent;
  payload: Component;
}
interface ResetModuleActionType {
  type: typeof ACTION_TYPES.resetModule;
}
interface ResetModulesActionType {
  type: typeof ACTION_TYPES.resetModules;
}
export const loadModulesAction = stryMutAct_9fa48("5523") ? () => undefined : (stryCov_9fa48("5523"), (() => {
  const loadModulesAction = (payload: ModulePagination): LoadModulesActionType => stryMutAct_9fa48("5524") ? {} : (stryCov_9fa48("5524"), {
    type: ACTION_TYPES.loadModules,
    payload
  });

  return loadModulesAction;
})());
export const loadModuleAction = stryMutAct_9fa48("5525") ? () => undefined : (stryCov_9fa48("5525"), (() => {
  const loadModuleAction = (payload: Module): LoadModuleActionType => stryMutAct_9fa48("5526") ? {} : (stryCov_9fa48("5526"), {
    type: ACTION_TYPES.loadModule,
    payload
  });

  return loadModuleAction;
})());
export const loadComponentAction = stryMutAct_9fa48("5527") ? () => undefined : (stryCov_9fa48("5527"), (() => {
  const loadComponentAction = (payload: Component): LoadComponentActionType => stryMutAct_9fa48("5528") ? {} : (stryCov_9fa48("5528"), {
    type: ACTION_TYPES.loadComponent,
    payload
  });

  return loadComponentAction;
})());
export const resetModuleAction = stryMutAct_9fa48("5529") ? () => undefined : (stryCov_9fa48("5529"), (() => {
  const resetModuleAction = (): ResetModuleActionType => stryMutAct_9fa48("5530") ? {} : (stryCov_9fa48("5530"), {
    type: ACTION_TYPES.resetModule
  });

  return resetModuleAction;
})());
export const resetModulesAction = stryMutAct_9fa48("5531") ? () => undefined : (stryCov_9fa48("5531"), (() => {
  const resetModulesAction = (): ResetModulesActionType => stryMutAct_9fa48("5532") ? {} : (stryCov_9fa48("5532"), {
    type: ACTION_TYPES.resetModules
  });

  return resetModulesAction;
})());
export type ModulesActionTypes = LoadModulesActionType | LoadModuleActionType | LoadComponentActionType | ResetModuleActionType | ResetModulesActionType;