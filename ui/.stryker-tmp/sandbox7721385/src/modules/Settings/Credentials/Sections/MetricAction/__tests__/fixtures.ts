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

import { Action, ActionForm } from "../types";
export const actionsData: Action[] = stryMutAct_9fa48("5752") ? [] : (stryCov_9fa48("5752"), [stryMutAct_9fa48("5753") ? {} : (stryCov_9fa48("5753"), {
  'id': stryMutAct_9fa48("5754") ? "" : (stryCov_9fa48("5754"), '1'),
  'nickname': stryMutAct_9fa48("5755") ? "" : (stryCov_9fa48("5755"), 'Action 1')
}), stryMutAct_9fa48("5756") ? {} : (stryCov_9fa48("5756"), {
  'id': stryMutAct_9fa48("5757") ? "" : (stryCov_9fa48("5757"), '2'),
  'nickname': stryMutAct_9fa48("5758") ? "" : (stryCov_9fa48("5758"), 'Action 2')
})]);
export const pluginsData = stryMutAct_9fa48("5759") ? [] : (stryCov_9fa48("5759"), [stryMutAct_9fa48("5760") ? {} : (stryCov_9fa48("5760"), {
  'id': stryMutAct_9fa48("5761") ? "" : (stryCov_9fa48("5761"), '1'),
  'category': stryMutAct_9fa48("5762") ? "" : (stryCov_9fa48("5762"), 'actionDeploy'),
  'name': stryMutAct_9fa48("5763") ? "" : (stryCov_9fa48("5763"), 'plugin 1'),
  'src': stryMutAct_9fa48("5764") ? "" : (stryCov_9fa48("5764"), 'plugin/action/deploy'),
  'description': stryMutAct_9fa48("5765") ? "" : (stryCov_9fa48("5765"), 'deploy plugin 1'),
  'inputParameters': stryMutAct_9fa48("5766") ? "" : (stryCov_9fa48("5766"), 'input 1')
}), stryMutAct_9fa48("5767") ? {} : (stryCov_9fa48("5767"), {
  'id': stryMutAct_9fa48("5768") ? "" : (stryCov_9fa48("5768"), '1'),
  'category': stryMutAct_9fa48("5769") ? "" : (stryCov_9fa48("5769"), 'actionDeploy'),
  'name': stryMutAct_9fa48("5770") ? "" : (stryCov_9fa48("5770"), 'plugin 1'),
  'src': stryMutAct_9fa48("5771") ? "" : (stryCov_9fa48("5771"), 'plugin/action/deploy'),
  'description': stryMutAct_9fa48("5772") ? "" : (stryCov_9fa48("5772"), 'deploy plugin 1'),
  'inputParameters': stryMutAct_9fa48("5773") ? "" : (stryCov_9fa48("5773"), 'input 1')
})]);
export const actionFormData: ActionForm = stryMutAct_9fa48("5774") ? {} : (stryCov_9fa48("5774"), {
  'nickname': stryMutAct_9fa48("5775") ? "" : (stryCov_9fa48("5775"), 'test'),
  'description': stryMutAct_9fa48("5776") ? "" : (stryCov_9fa48("5776"), 'description test'),
  'type': stryMutAct_9fa48("5777") ? "" : (stryCov_9fa48("5777"), 'action type'),
  'configuration': stryMutAct_9fa48("5778") ? "" : (stryCov_9fa48("5778"), 'test url')
});
export const actionDefaultPayload = stryMutAct_9fa48("5779") ? {} : (stryCov_9fa48("5779"), {
  'nickname': stryMutAct_9fa48("5780") ? "" : (stryCov_9fa48("5780"), 'test'),
  'description': stryMutAct_9fa48("5781") ? "" : (stryCov_9fa48("5781"), 'description test'),
  'type': stryMutAct_9fa48("5782") ? "" : (stryCov_9fa48("5782"), 'action type'),
  'configuration': stryMutAct_9fa48("5783") ? "" : (stryCov_9fa48("5783"), 'test url'),
  'useDefaultConfiguration': stryMutAct_9fa48("5784") ? false : (stryCov_9fa48("5784"), true)
});
export const actionNotDefaultPayload = stryMutAct_9fa48("5785") ? {} : (stryCov_9fa48("5785"), {
  'nickname': stryMutAct_9fa48("5786") ? "" : (stryCov_9fa48("5786"), 'test'),
  'description': stryMutAct_9fa48("5787") ? "" : (stryCov_9fa48("5787"), 'description test'),
  'type': stryMutAct_9fa48("5788") ? "" : (stryCov_9fa48("5788"), 'action type'),
  'useDefaultConfiguration': stryMutAct_9fa48("5789") ? true : (stryCov_9fa48("5789"), false),
  'configuration': stryMutAct_9fa48("5790") ? {} : (stryCov_9fa48("5790"), {
    'mooveUrl': stryMutAct_9fa48("5791") ? "" : (stryCov_9fa48("5791"), 'test url')
  })
});