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

import { Option } from 'core/components/Form/Select/interfaces';
import map from 'lodash/map';
import includes from 'lodash/includes';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';
export const normalizeCircleParams = (circles: Option[]) => {
  if (stryMutAct_9fa48("5098")) {
    {}
  } else {
    stryCov_9fa48("5098");
    const filteredCircles = includes(circles, allOption) ? stryMutAct_9fa48("5099") ? ["Stryker was here"] : (stryCov_9fa48("5099"), []) : circles;
    return map(filteredCircles, stryMutAct_9fa48("5100") ? "" : (stryCov_9fa48("5100"), 'value'));
  }
};
export enum STATUS {
  NOT_DEPLOYED = 'notDeployed',
  DEPLOYED = 'deployed',
  DEPLOYING = 'deploying',
  DEPLOY_FAILED = 'error',
  UNDEPLOYING = 'undeploying',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export const getStatus = (statusEnum: string) => {
  if (stryMutAct_9fa48("5101")) {
    {}
  } else {
    stryCov_9fa48("5101");

    switch (statusEnum) {
      case stryMutAct_9fa48("5103") ? "" : (stryCov_9fa48("5103"), 'NOT_DEPLOYED'):
        if (stryMutAct_9fa48("5102")) {} else {
          stryCov_9fa48("5102");
          return STATUS.NOT_DEPLOYED;
        }

      case stryMutAct_9fa48("5105") ? "" : (stryCov_9fa48("5105"), 'DEPLOYED'):
        if (stryMutAct_9fa48("5104")) {} else {
          stryCov_9fa48("5104");
          return STATUS.DEPLOYED;
        }

      case stryMutAct_9fa48("5107") ? "" : (stryCov_9fa48("5107"), 'DEPLOYING'):
        if (stryMutAct_9fa48("5106")) {} else {
          stryCov_9fa48("5106");
          return STATUS.DEPLOYING;
        }

      case stryMutAct_9fa48("5109") ? "" : (stryCov_9fa48("5109"), 'DEPLOY_FAILED'):
        if (stryMutAct_9fa48("5108")) {} else {
          stryCov_9fa48("5108");
          return STATUS.DEPLOY_FAILED;
        }

      case stryMutAct_9fa48("5111") ? "" : (stryCov_9fa48("5111"), 'UNDEPLOYING'):
        if (stryMutAct_9fa48("5110")) {} else {
          stryCov_9fa48("5110");
          return STATUS.UNDEPLOYING;
        }

      case stryMutAct_9fa48("5113") ? "" : (stryCov_9fa48("5113"), 'ACTIVE'):
        if (stryMutAct_9fa48("5112")) {} else {
          stryCov_9fa48("5112");
          return STATUS.ACTIVE;
        }

      case stryMutAct_9fa48("5115") ? "" : (stryCov_9fa48("5115"), 'INACTIVE'):
        if (stryMutAct_9fa48("5114")) {} else {
          stryCov_9fa48("5114");
          return STATUS.INACTIVE;
        }

      default:
        if (stryMutAct_9fa48("5116")) {} else {
          stryCov_9fa48("5116");
          return STATUS.DEPLOYED;
        }

    }
  }
};