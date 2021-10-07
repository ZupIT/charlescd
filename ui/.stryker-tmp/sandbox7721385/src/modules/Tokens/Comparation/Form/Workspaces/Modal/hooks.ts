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

import { useCallback, useRef, useState } from 'react';
import { WorkspacePagination, WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { findAll } from 'core/providers/workspace';
type WorkspaceResponse = {
  workspaces: WorkspacePaginationItem[];
  status: FetchStatuses;
  last: boolean;
};
export const useWorkspaces = (): {
  getWorkspaces: Function;
  resetWorkspaces: Function;
  data: WorkspaceResponse;
} => {
  if (stryMutAct_9fa48("6540")) {
    {}
  } else {
    stryCov_9fa48("6540");
    const findWorkspaces = useFetchData<WorkspacePagination>(findAll);
    const reset = useRef<boolean>(stryMutAct_9fa48("6541") ? true : (stryCov_9fa48("6541"), false));
    const [data, setData] = useState<WorkspaceResponse>(stryMutAct_9fa48("6542") ? {} : (stryCov_9fa48("6542"), {
      workspaces: stryMutAct_9fa48("6543") ? ["Stryker was here"] : (stryCov_9fa48("6543"), []),
      status: stryMutAct_9fa48("6544") ? "" : (stryCov_9fa48("6544"), 'idle'),
      last: stryMutAct_9fa48("6545") ? false : (stryCov_9fa48("6545"), true)
    }));
    const resetWorkspaces = stryMutAct_9fa48("6546") ? () => undefined : (stryCov_9fa48("6546"), (() => {
      const resetWorkspaces = () => reset.current = stryMutAct_9fa48("6547") ? false : (stryCov_9fa48("6547"), true);

      return resetWorkspaces;
    })());
    const getWorkspaces = useCallback(async (name: string, page: string) => {
      if (stryMutAct_9fa48("6548")) {
        {}
      } else {
        stryCov_9fa48("6548");

        try {
          if (stryMutAct_9fa48("6549")) {
            {}
          } else {
            stryCov_9fa48("6549");
            setData(stryMutAct_9fa48("6550") ? {} : (stryCov_9fa48("6550"), { ...data,
              status: stryMutAct_9fa48("6551") ? "" : (stryCov_9fa48("6551"), 'pending')
            }));
            const res = await findWorkspaces(stryMutAct_9fa48("6552") ? {} : (stryCov_9fa48("6552"), {
              name,
              page
            }));
            setData(stryMutAct_9fa48("6553") ? {} : (stryCov_9fa48("6553"), {
              workspaces: reset.current ? res.content : stryMutAct_9fa48("6554") ? [] : (stryCov_9fa48("6554"), [...data.workspaces, ...res.content]),
              last: res.last,
              status: stryMutAct_9fa48("6555") ? "" : (stryCov_9fa48("6555"), 'resolved')
            }));
            reset.current = stryMutAct_9fa48("6556") ? true : (stryCov_9fa48("6556"), false);
          }
        } catch (e) {
          if (stryMutAct_9fa48("6557")) {
            {}
          } else {
            stryCov_9fa48("6557");
            setData(stryMutAct_9fa48("6558") ? {} : (stryCov_9fa48("6558"), { ...data,
              status: stryMutAct_9fa48("6559") ? "" : (stryCov_9fa48("6559"), 'rejected')
            }));
          }
        }
      }
    }, stryMutAct_9fa48("6560") ? [] : (stryCov_9fa48("6560"), [findWorkspaces, data]));
    return stryMutAct_9fa48("6561") ? {} : (stryCov_9fa48("6561"), {
      getWorkspaces,
      resetWorkspaces,
      data
    });
  }
};