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

import { rootMainMenu, mainMenu, workspaceMenu, MenuType } from '../constants';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import { isRoot } from 'core/utils/auth';
export const getExpandIcon = stryMutAct_9fa48("4711") ? () => undefined : (stryCov_9fa48("4711"), (() => {
  const getExpandIcon = (expand: boolean) => expand ? stryMutAct_9fa48("4712") ? "" : (stryCov_9fa48("4712"), 'menu-expanded') : stryMutAct_9fa48("4713") ? "" : (stryCov_9fa48("4713"), 'menu');

  return getExpandIcon;
})());
export const getItems = () => {
  if (stryMutAct_9fa48("4714")) {
    {}
  } else {
    stryCov_9fa48("4714");
    const [, path] = window.location.pathname.split(stryMutAct_9fa48("4715") ? "" : (stryCov_9fa48("4715"), '/'));
    let currentMenu: MenuType[] = stryMutAct_9fa48("4716") ? ["Stryker was here"] : (stryCov_9fa48("4716"), []);
    const menus = isRoot() ? stryMutAct_9fa48("4717") ? [] : (stryCov_9fa48("4717"), [workspaceMenu, rootMainMenu]) : stryMutAct_9fa48("4718") ? [] : (stryCov_9fa48("4718"), [workspaceMenu, mainMenu]);
    forEach(menus, menu => {
      if (stryMutAct_9fa48("4719")) {
        {}
      } else {
        stryCov_9fa48("4719");
        find(menu, ({
          to
        }) => {
          if (stryMutAct_9fa48("4720")) {
            {}
          } else {
            stryCov_9fa48("4720");

            if (stryMutAct_9fa48("4722") ? false : stryMutAct_9fa48("4721") ? true : (stryCov_9fa48("4721", "4722"), to.includes(stryMutAct_9fa48("4723") ? `` : (stryCov_9fa48("4723"), `/${path}`)))) {
              if (stryMutAct_9fa48("4724")) {
                {}
              } else {
                stryCov_9fa48("4724");
                currentMenu = menu;
              }
            }
          }
        });
      }
    });
    return currentMenu;
  }
};