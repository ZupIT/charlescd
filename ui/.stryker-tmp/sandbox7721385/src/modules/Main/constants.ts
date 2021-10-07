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

import routes from 'core/constants/routes';
import { genMenuId } from 'core/utils/menu';
export type MenuType = {
  id: string;
  icon: string;
  text: string;
  to: string;
  action?: string;
  subject?: string;
};
export const workspaceMenu: MenuType[] = stryMutAct_9fa48("4725") ? [] : (stryCov_9fa48("4725"), [stryMutAct_9fa48("4726") ? {} : (stryCov_9fa48("4726"), {
  id: genMenuId(routes.circles),
  icon: stryMutAct_9fa48("4727") ? "" : (stryCov_9fa48("4727"), 'circles'),
  text: stryMutAct_9fa48("4728") ? "" : (stryCov_9fa48("4728"), 'Circles'),
  to: routes.circles,
  action: stryMutAct_9fa48("4729") ? "" : (stryCov_9fa48("4729"), 'read'),
  subject: stryMutAct_9fa48("4730") ? "" : (stryCov_9fa48("4730"), 'circles')
}), stryMutAct_9fa48("4731") ? {} : (stryCov_9fa48("4731"), {
  id: genMenuId(routes.modules),
  icon: stryMutAct_9fa48("4732") ? "" : (stryCov_9fa48("4732"), 'modules'),
  text: stryMutAct_9fa48("4733") ? "" : (stryCov_9fa48("4733"), 'Modules'),
  to: routes.modules,
  action: stryMutAct_9fa48("4734") ? "" : (stryCov_9fa48("4734"), 'read'),
  subject: stryMutAct_9fa48("4735") ? "" : (stryCov_9fa48("4735"), 'modules')
}), stryMutAct_9fa48("4736") ? {} : (stryCov_9fa48("4736"), {
  id: genMenuId(routes.metrics),
  icon: stryMutAct_9fa48("4737") ? "" : (stryCov_9fa48("4737"), 'metrics'),
  text: stryMutAct_9fa48("4738") ? "" : (stryCov_9fa48("4738"), 'Metrics'),
  to: routes.metrics,
  action: stryMutAct_9fa48("4739") ? "" : (stryCov_9fa48("4739"), 'read'),
  subject: stryMutAct_9fa48("4740") ? "" : (stryCov_9fa48("4740"), 'circles')
}), stryMutAct_9fa48("4741") ? {} : (stryCov_9fa48("4741"), {
  id: genMenuId(routes.settings),
  icon: stryMutAct_9fa48("4742") ? "" : (stryCov_9fa48("4742"), 'settings'),
  text: stryMutAct_9fa48("4743") ? "" : (stryCov_9fa48("4743"), 'Settings'),
  to: routes.credentials,
  action: stryMutAct_9fa48("4744") ? "" : (stryCov_9fa48("4744"), 'write'),
  subject: stryMutAct_9fa48("4745") ? "" : (stryCov_9fa48("4745"), 'maintenance')
})]);
export const mainMenu: MenuType[] = stryMutAct_9fa48("4746") ? [] : (stryCov_9fa48("4746"), [stryMutAct_9fa48("4747") ? {} : (stryCov_9fa48("4747"), {
  id: genMenuId(routes.workspaces),
  icon: stryMutAct_9fa48("4748") ? "" : (stryCov_9fa48("4748"), 'workspaces'),
  text: stryMutAct_9fa48("4749") ? "" : (stryCov_9fa48("4749"), 'Workspaces'),
  to: routes.workspaces
}), stryMutAct_9fa48("4750") ? {} : (stryCov_9fa48("4750"), {
  id: genMenuId(routes.accountProfile),
  icon: stryMutAct_9fa48("4751") ? "" : (stryCov_9fa48("4751"), 'account'),
  text: stryMutAct_9fa48("4752") ? "" : (stryCov_9fa48("4752"), 'Account'),
  to: routes.accountProfile
})]);
export const rootMainMenu: MenuType[] = stryMutAct_9fa48("4753") ? [] : (stryCov_9fa48("4753"), [stryMutAct_9fa48("4754") ? {} : (stryCov_9fa48("4754"), {
  id: genMenuId(routes.workspaces),
  icon: stryMutAct_9fa48("4755") ? "" : (stryCov_9fa48("4755"), 'workspace'),
  text: stryMutAct_9fa48("4756") ? "" : (stryCov_9fa48("4756"), 'Workspaces'),
  to: routes.workspaces
}), stryMutAct_9fa48("4757") ? {} : (stryCov_9fa48("4757"), {
  id: genMenuId(routes.tokens),
  icon: stryMutAct_9fa48("4758") ? "" : (stryCov_9fa48("4758"), 'token'),
  text: stryMutAct_9fa48("4759") ? "" : (stryCov_9fa48("4759"), 'Access tokens'),
  to: routes.tokens
}), stryMutAct_9fa48("4760") ? {} : (stryCov_9fa48("4760"), {
  id: genMenuId(routes.users),
  icon: stryMutAct_9fa48("4761") ? "" : (stryCov_9fa48("4761"), 'user'),
  text: stryMutAct_9fa48("4762") ? "" : (stryCov_9fa48("4762"), 'Users'),
  to: routes.users
}), stryMutAct_9fa48("4763") ? {} : (stryCov_9fa48("4763"), {
  id: genMenuId(routes.groups),
  icon: stryMutAct_9fa48("4764") ? "" : (stryCov_9fa48("4764"), 'users'),
  text: stryMutAct_9fa48("4765") ? "" : (stryCov_9fa48("4765"), 'User Group'),
  to: routes.groups
}), stryMutAct_9fa48("4766") ? {} : (stryCov_9fa48("4766"), {
  id: genMenuId(routes.accountProfile),
  icon: stryMutAct_9fa48("4767") ? "" : (stryCov_9fa48("4767"), 'account'),
  text: stryMutAct_9fa48("4768") ? "" : (stryCov_9fa48("4768"), 'Account'),
  to: routes.accountProfile
})]);