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

import { User } from 'modules/Users/interfaces/User';
import map from 'lodash/map';
import filter from 'lodash/filter';
import some from 'lodash/some';
import { UserChecked } from '../interfaces/UserChecked';
const filterSelectedUsers = stryMutAct_9fa48("4402") ? () => undefined : (stryCov_9fa48("4402"), (() => {
  const filterSelectedUsers = (selectedUsers: UserChecked[], search: string) => filter(selectedUsers, stryMutAct_9fa48("4403") ? () => undefined : (stryCov_9fa48("4403"), ({
    email
  }) => stryMutAct_9fa48("4406") ? email?.toLocaleLowerCase().indexOf(search?.toLowerCase()) === -1 : stryMutAct_9fa48("4405") ? false : stryMutAct_9fa48("4404") ? true : (stryCov_9fa48("4404", "4405", "4406"), (stryMutAct_9fa48("4407") ? email.toLocaleLowerCase().indexOf(search?.toLowerCase()) : (stryCov_9fa48("4407"), email?.toLocaleLowerCase().indexOf(stryMutAct_9fa48("4408") ? search.toLowerCase() : (stryCov_9fa48("4408"), search?.toLowerCase())))) !== (stryMutAct_9fa48("4409") ? +1 : (stryCov_9fa48("4409"), -1)))));

  return filterSelectedUsers;
})());

const getNotIncludedUsers = (search: string, selectedUsers: UserChecked[], filteredUsers: UserChecked[]) => {
  if (stryMutAct_9fa48("4410")) {
    {}
  } else {
    stryCov_9fa48("4410");
    const filteredSelectedUsers = filterSelectedUsers(selectedUsers, search);
    return filter(filteredUsers, stryMutAct_9fa48("4411") ? () => undefined : (stryCov_9fa48("4411"), noMember => stryMutAct_9fa48("4412") ? some(filteredSelectedUsers, member => noMember.name === member.name) : (stryCov_9fa48("4412"), !some(filteredSelectedUsers, stryMutAct_9fa48("4413") ? () => undefined : (stryCov_9fa48("4413"), member => stryMutAct_9fa48("4416") ? noMember.name !== member.name : stryMutAct_9fa48("4415") ? false : stryMutAct_9fa48("4414") ? true : (stryCov_9fa48("4414", "4415", "4416"), noMember.name === member.name))))));
  }
};

export const diffCheckedUsers = (search: string, selectedUsers: User[], filteredUsers: User[]) => {
  if (stryMutAct_9fa48("4417")) {
    {}
  } else {
    stryCov_9fa48("4417");
    const mappedSelectedUsers = map(selectedUsers, stryMutAct_9fa48("4418") ? () => undefined : (stryCov_9fa48("4418"), user => stryMutAct_9fa48("4419") ? {} : (stryCov_9fa48("4419"), { ...user,
      checked: stryMutAct_9fa48("4420") ? false : (stryCov_9fa48("4420"), true)
    })));
    const mappedFilteredUsers = map(filteredUsers, stryMutAct_9fa48("4421") ? () => undefined : (stryCov_9fa48("4421"), user => stryMutAct_9fa48("4422") ? {} : (stryCov_9fa48("4422"), { ...user,
      checked: stryMutAct_9fa48("4423") ? true : (stryCov_9fa48("4423"), false)
    })));
    const filteredSelectedUsers = filterSelectedUsers(mappedSelectedUsers, search);
    const notIncludedUsers = getNotIncludedUsers(search, filteredSelectedUsers, mappedFilteredUsers);
    return stryMutAct_9fa48("4424") ? [] : (stryCov_9fa48("4424"), [...filteredSelectedUsers, ...notIncludedUsers]);
  }
};