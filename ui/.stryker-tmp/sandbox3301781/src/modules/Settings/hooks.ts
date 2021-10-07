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

import { useState, useCallback } from 'react';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { findById, updateName } from 'core/providers/workspace';
import { useDispatch } from 'core/state/hooks';
import { Workspace } from './Workspaces/interfaces/Workspace';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { loadedWorkspaceAction } from 'modules/Workspaces/state/actions';
type WorkspasceResponse = {
  workspace: Workspace;
  status: FetchStatuses;
};
export const useWorkspace = (): {
  getWorkspace: Function;
  data: WorkspasceResponse;
} => {
  if (stryMutAct_9fa48("6421")) {
    {}
  } else {
    stryCov_9fa48("6421");
    const getWorkspaceById = useFetchData<Workspace>(findById);
    const [data, setData] = useState<WorkspasceResponse>(stryMutAct_9fa48("6422") ? {} : (stryCov_9fa48("6422"), {
      workspace: null,
      status: stryMutAct_9fa48("6423") ? "" : (stryCov_9fa48("6423"), 'idle')
    }));
    const dispatch = useDispatch();
    const getWorkspace = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("6424")) {
        {}
      } else {
        stryCov_9fa48("6424");
        setData(stryMutAct_9fa48("6425") ? {} : (stryCov_9fa48("6425"), { ...data,
          status: stryMutAct_9fa48("6426") ? "" : (stryCov_9fa48("6426"), 'pending')
        }));

        try {
          if (stryMutAct_9fa48("6427")) {
            {}
          } else {
            stryCov_9fa48("6427");
            const workspace = await getWorkspaceById(stryMutAct_9fa48("6428") ? {} : (stryCov_9fa48("6428"), {
              id
            }));
            setData(stryMutAct_9fa48("6429") ? {} : (stryCov_9fa48("6429"), {
              workspace,
              status: stryMutAct_9fa48("6430") ? "" : (stryCov_9fa48("6430"), 'resolved')
            }));
            dispatch(loadedWorkspaceAction(workspace));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6431")) {
            {}
          } else {
            stryCov_9fa48("6431");

            if (stryMutAct_9fa48("6434") ? error.status === 403 : stryMutAct_9fa48("6433") ? false : stryMutAct_9fa48("6432") ? true : (stryCov_9fa48("6432", "6433", "6434"), error.status !== 403)) {
              if (stryMutAct_9fa48("6435")) {
                {}
              } else {
                stryCov_9fa48("6435");
                setData(stryMutAct_9fa48("6436") ? {} : (stryCov_9fa48("6436"), { ...data,
                  status: stryMutAct_9fa48("6437") ? "" : (stryCov_9fa48("6437"), 'rejected')
                }));
                dispatch(toogleNotification(stryMutAct_9fa48("6438") ? {} : (stryCov_9fa48("6438"), {
                  text: stryMutAct_9fa48("6439") ? `` : (stryCov_9fa48("6439"), `[${error.status}] Could not list`),
                  status: stryMutAct_9fa48("6440") ? "" : (stryCov_9fa48("6440"), 'error')
                })));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("6441") ? [] : (stryCov_9fa48("6441"), [getWorkspaceById, dispatch, data]));
    return stryMutAct_9fa48("6442") ? {} : (stryCov_9fa48("6442"), {
      getWorkspace,
      data
    });
  }
};
export const useWorkspaceUpdateName = () => {
  if (stryMutAct_9fa48("6443")) {
    {}
  } else {
    stryCov_9fa48("6443");
    const updateWorkspace = useFetchData(updateName);
    const dispatch = useDispatch();
    const updateWorkspaceName = useCallback(async (name: string) => {
      if (stryMutAct_9fa48("6444")) {
        {}
      } else {
        stryCov_9fa48("6444");

        try {
          if (stryMutAct_9fa48("6445")) {
            {}
          } else {
            stryCov_9fa48("6445");
            await updateWorkspace(name);
          }
        } catch (error) {
          if (stryMutAct_9fa48("6446")) {
            {}
          } else {
            stryCov_9fa48("6446");
            dispatch(toogleNotification(stryMutAct_9fa48("6447") ? {} : (stryCov_9fa48("6447"), {
              text: stryMutAct_9fa48("6448") ? `` : (stryCov_9fa48("6448"), `[${error.status}] Could not update`),
              status: stryMutAct_9fa48("6449") ? "" : (stryCov_9fa48("6449"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6450") ? [] : (stryCov_9fa48("6450"), [updateWorkspace, dispatch]));
    return stryMutAct_9fa48("6451") ? {} : (stryCov_9fa48("6451"), {
      updateWorkspaceName
    });
  }
};
export default useWorkspace;