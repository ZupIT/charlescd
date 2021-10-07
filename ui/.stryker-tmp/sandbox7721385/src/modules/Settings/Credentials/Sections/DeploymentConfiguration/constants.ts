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

import { RadioButtonProps } from 'core/components/RadioButtons';
export const DEFAULT_BRANCH = stryMutAct_9fa48("5611") ? "" : (stryCov_9fa48("5611"), 'main');
export const FORM_CD_CONFIGURATION = stryMutAct_9fa48("5612") ? "" : (stryCov_9fa48("5612"), 'cd-configuration');
export const radios: RadioButtonProps[] = stryMutAct_9fa48("5613") ? [] : (stryCov_9fa48("5613"), [stryMutAct_9fa48("5614") ? {} : (stryCov_9fa48("5614"), {
  icon: stryMutAct_9fa48("5615") ? "" : (stryCov_9fa48("5615"), 'charlescd'),
  name: stryMutAct_9fa48("5616") ? "" : (stryCov_9fa48("5616"), 'CharlesCD'),
  value: stryMutAct_9fa48("5617") ? "" : (stryCov_9fa48("5617"), 'OCTOPIPE')
}), stryMutAct_9fa48("5618") ? {} : (stryCov_9fa48("5618"), {
  icon: stryMutAct_9fa48("5619") ? "" : (stryCov_9fa48("5619"), 'spinnaker'),
  name: stryMutAct_9fa48("5620") ? "" : (stryCov_9fa48("5620"), 'Spinnaker'),
  value: stryMutAct_9fa48("5621") ? "" : (stryCov_9fa48("5621"), 'SPINNAKER')
})]);
export const githubProvider = stryMutAct_9fa48("5622") ? {} : (stryCov_9fa48("5622"), {
  value: stryMutAct_9fa48("5623") ? "" : (stryCov_9fa48("5623"), 'GITHUB'),
  label: stryMutAct_9fa48("5624") ? "" : (stryCov_9fa48("5624"), 'GitHub'),
  icon: stryMutAct_9fa48("5625") ? "" : (stryCov_9fa48("5625"), 'github')
});
export const gitlabProvider = stryMutAct_9fa48("5626") ? {} : (stryCov_9fa48("5626"), {
  value: stryMutAct_9fa48("5627") ? "" : (stryCov_9fa48("5627"), 'GITLAB'),
  label: stryMutAct_9fa48("5628") ? "" : (stryCov_9fa48("5628"), 'GitLab'),
  icon: stryMutAct_9fa48("5629") ? "" : (stryCov_9fa48("5629"), 'gitlab')
});
export const gitProviders = stryMutAct_9fa48("5630") ? [] : (stryCov_9fa48("5630"), [githubProvider, gitlabProvider]);
export const providers: RadioButtonProps[] = stryMutAct_9fa48("5631") ? [] : (stryCov_9fa48("5631"), [stryMutAct_9fa48("5632") ? {} : (stryCov_9fa48("5632"), {
  name: stryMutAct_9fa48("5633") ? "" : (stryCov_9fa48("5633"), 'Default'),
  value: stryMutAct_9fa48("5634") ? "" : (stryCov_9fa48("5634"), 'DEFAULT')
}), stryMutAct_9fa48("5635") ? {} : (stryCov_9fa48("5635"), {
  name: stryMutAct_9fa48("5636") ? "" : (stryCov_9fa48("5636"), 'EKS'),
  value: stryMutAct_9fa48("5637") ? "" : (stryCov_9fa48("5637"), 'EKS')
}), stryMutAct_9fa48("5638") ? {} : (stryCov_9fa48("5638"), {
  name: stryMutAct_9fa48("5639") ? "" : (stryCov_9fa48("5639"), 'Others'),
  value: stryMutAct_9fa48("5640") ? "" : (stryCov_9fa48("5640"), 'GENERIC')
})]);