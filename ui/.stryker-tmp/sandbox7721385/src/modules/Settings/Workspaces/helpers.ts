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

import without from 'lodash/without';
import { History } from 'history';
import map from 'lodash/map';
import routes from 'core/constants/routes';
import getQueryStrings from 'core/utils/query';
export const addParamWorkspace = (history: History, WorkspaceId: string) => {
  if (stryMutAct_9fa48("6364")) {
    {}
  } else {
    stryCov_9fa48("6364");
    const query = getQueryStrings();
    query.append(stryMutAct_9fa48("6365") ? "" : (stryCov_9fa48("6365"), 'workspace'), WorkspaceId);
    history.push(stryMutAct_9fa48("6366") ? {} : (stryCov_9fa48("6366"), {
      pathname: routes.workspacesComparation,
      search: query.toString()
    }));
  }
};
export const delParamWorkspace = (history: History, workspaceId: string) => {
  if (stryMutAct_9fa48("6367")) {
    {}
  } else {
    stryCov_9fa48("6367");
    const query = getQueryStrings();
    const workspaces = query.getAll(stryMutAct_9fa48("6368") ? "" : (stryCov_9fa48("6368"), 'workspace'));
    const remaineds = without(workspaces, workspaceId);
    const params = new URLSearchParams();
    map(remaineds, stryMutAct_9fa48("6369") ? () => undefined : (stryCov_9fa48("6369"), id => params.append(stryMutAct_9fa48("6370") ? "" : (stryCov_9fa48("6370"), 'workspace'), id)));
    history.push(stryMutAct_9fa48("6371") ? {} : (stryCov_9fa48("6371"), {
      pathname: routes.workspacesComparation,
      search: params.toString()
    }));
  }
};