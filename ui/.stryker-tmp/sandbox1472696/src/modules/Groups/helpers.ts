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
import some from 'lodash/some';
import method from 'lodash/method';
import routes from 'core/constants/routes';
import getQueryStrings from 'core/utils/query';
import includes from 'lodash/includes';
import reverse from 'lodash/reverse';
const paramName = stryMutAct_9fa48("4472") ? "" : (stryCov_9fa48("4472"), 'usergroup');
export const getSelectedUserGroups = () => {
  if (stryMutAct_9fa48("4473")) {
    {}
  } else {
    stryCov_9fa48("4473");
    const query = getQueryStrings();
    return reverse(query.getAll(paramName));
  }
};
export const delParamUserGroup = (history: History, usergroupId: string) => {
  if (stryMutAct_9fa48("4474")) {
    {}
  } else {
    stryCov_9fa48("4474");
    const query = getQueryStrings();
    const userGroups = query.getAll(paramName);
    const remaineds = without(userGroups, usergroupId);
    const params = new URLSearchParams();
    map(remaineds, stryMutAct_9fa48("4475") ? () => undefined : (stryCov_9fa48("4475"), id => params.append(paramName, id)));
    history.push(stryMutAct_9fa48("4476") ? {} : (stryCov_9fa48("4476"), {
      pathname: routes.groupsShow,
      search: params.toString()
    }));
  }
};
export const addParamUserGroup = (history: History, usergroupId: string) => {
  if (stryMutAct_9fa48("4477")) {
    {}
  } else {
    stryCov_9fa48("4477");

    if (stryMutAct_9fa48("4479") ? false : stryMutAct_9fa48("4478") ? true : (stryCov_9fa48("4478", "4479"), includes(getSelectedUserGroups(), usergroupId))) {
      if (stryMutAct_9fa48("4480")) {
        {}
      } else {
        stryCov_9fa48("4480");
        delParamUserGroup(history, usergroupId);
        return;
      }
    }

    const query = getQueryStrings();
    query.append(paramName, usergroupId);
    stryMutAct_9fa48("4481") ? history.push({
      pathname: routes.groupsShow,
      search: query.toString()
    }) : (stryCov_9fa48("4481"), history?.push(stryMutAct_9fa48("4482") ? {} : (stryCov_9fa48("4482"), {
      pathname: routes.groupsShow,
      search: query.toString()
    })));
  }
};
export const isActiveById = stryMutAct_9fa48("4483") ? () => undefined : (stryCov_9fa48("4483"), (() => {
  const isActiveById = (id: string) => some(getSelectedUserGroups(), method(stryMutAct_9fa48("4484") ? "" : (stryCov_9fa48("4484"), 'includes'), id));

  return isActiveById;
})());