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

import { useCallback } from 'react';
import { useFetchData, useFetchStatus, FetchStatus } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { CheckPassword } from 'modules/Account/interfaces/ChangePassword';
import { changePassword } from 'core/providers/users';
import { toogleNotification } from 'core/components/Notification/state/actions';
export const useChangePassword = (): {
  updatePassword: Function;
  status: FetchStatus;
} => {
  if (stryMutAct_9fa48("2593")) {
    {}
  } else {
    stryCov_9fa48("2593");
    const changePass = useFetchData<CheckPassword>(changePassword);
    const dispatch = useDispatch();
    const status = useFetchStatus();
    const updatePassword = useCallback(async (payload: CheckPassword) => {
      if (stryMutAct_9fa48("2594")) {
        {}
      } else {
        stryCov_9fa48("2594");

        try {
          if (stryMutAct_9fa48("2595")) {
            {}
          } else {
            stryCov_9fa48("2595");
            status.pending();
            await changePass(payload);
            dispatch(toogleNotification(stryMutAct_9fa48("2596") ? {} : (stryCov_9fa48("2596"), {
              text: stryMutAct_9fa48("2597") ? "" : (stryCov_9fa48("2597"), 'Password changed successfully.'),
              status: stryMutAct_9fa48("2598") ? "" : (stryCov_9fa48("2598"), 'success')
            })));
            status.resolved();
          }
        } catch (e) {
          if (stryMutAct_9fa48("2599")) {
            {}
          } else {
            stryCov_9fa48("2599");
            dispatch(toogleNotification(stryMutAct_9fa48("2600") ? {} : (stryCov_9fa48("2600"), {
              text: stryMutAct_9fa48("2601") ? "" : (stryCov_9fa48("2601"), 'it was not possible to change the password.'),
              status: stryMutAct_9fa48("2602") ? "" : (stryCov_9fa48("2602"), 'error')
            })));
            status.rejected();
          }
        }
      }
    }, stryMutAct_9fa48("2603") ? [] : (stryCov_9fa48("2603"), [changePass, status, dispatch]));
    return stryMutAct_9fa48("2604") ? {} : (stryCov_9fa48("2604"), {
      updatePassword,
      status
    });
  }
};