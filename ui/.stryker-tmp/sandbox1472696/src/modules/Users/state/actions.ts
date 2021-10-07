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

import { UserPagination } from '../interfaces/UserPagination';
import { User } from '../interfaces/User';
export enum ACTION_TYPES {
  loadedUsers = 'USERS/LOADED_USERS',
  loadedUser = 'USERS/LOADED_USER',
  resetContent = 'USERS/RESET_CONTENT',
}
interface LoadedUsersActionType {
  type: typeof ACTION_TYPES.loadedUsers;
  payload: UserPagination;
}
interface LoadedUserActionType {
  type: typeof ACTION_TYPES.loadedUser;
  payload: User;
}
export const LoadedUsersAction = stryMutAct_9fa48("6899") ? () => undefined : (stryCov_9fa48("6899"), (() => {
  const LoadedUsersAction = (payload: UserPagination): UsersActionTypes => stryMutAct_9fa48("6900") ? {} : (stryCov_9fa48("6900"), {
    type: ACTION_TYPES.loadedUsers,
    payload
  });

  return LoadedUsersAction;
})());
export const LoadedUserAction = stryMutAct_9fa48("6901") ? () => undefined : (stryCov_9fa48("6901"), (() => {
  const LoadedUserAction = (payload: User): UsersActionTypes => stryMutAct_9fa48("6902") ? {} : (stryCov_9fa48("6902"), {
    type: ACTION_TYPES.loadedUser,
    payload
  });

  return LoadedUserAction;
})());
interface ResetContentActionType {
  type: typeof ACTION_TYPES.resetContent;
}
export const resetContentAction = stryMutAct_9fa48("6903") ? () => undefined : (stryCov_9fa48("6903"), (() => {
  const resetContentAction = (): ResetContentActionType => stryMutAct_9fa48("6904") ? {} : (stryCov_9fa48("6904"), {
    type: ACTION_TYPES.resetContent
  });

  return resetContentAction;
})());
export type UsersActionTypes = LoadedUsersActionType | LoadedUserActionType | ResetContentActionType;