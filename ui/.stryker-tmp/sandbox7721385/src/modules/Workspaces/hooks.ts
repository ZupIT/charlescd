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

import { useEffect, useCallback, useState, useRef } from 'react';
import { FetchStatuses, useFetch, useFetchData } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { findAll, saveWorkspaceName } from 'core/providers/workspace';
import { findWorkspacesByUserId } from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { WorkspacePagination } from './interfaces/WorkspacePagination';
import { Workspace } from './interfaces/Workspace';
import { isRoot } from 'core/utils/auth';
import { getProfileByKey } from 'core/utils/profile';
import { saveWorkspace } from 'core/utils/workspace';
type WorkspaceResponse = {
  workspaces: Workspace[];
  status: FetchStatuses;
  last: boolean;
};
export const useWorkspaces = (): {
  getWorkspaces: Function;
  resetWorkspaces: Function;
  data: WorkspaceResponse;
} => {
  if (stryMutAct_9fa48("7091")) {
    {}
  } else {
    stryCov_9fa48("7091");
    const findWorkspaces = useFetchData<WorkspacePagination>(findAll);
    const findWorkspacesByUser = useFetchData<Workspace[]>(findWorkspacesByUserId);
    const reset = useRef<boolean>(stryMutAct_9fa48("7092") ? true : (stryCov_9fa48("7092"), false));
    const [data, setData] = useState<WorkspaceResponse>(stryMutAct_9fa48("7093") ? {} : (stryCov_9fa48("7093"), {
      workspaces: stryMutAct_9fa48("7094") ? ["Stryker was here"] : (stryCov_9fa48("7094"), []),
      status: stryMutAct_9fa48("7095") ? "" : (stryCov_9fa48("7095"), 'idle'),
      last: stryMutAct_9fa48("7096") ? false : (stryCov_9fa48("7096"), true)
    }));
    const resetWorkspaces = stryMutAct_9fa48("7097") ? () => undefined : (stryCov_9fa48("7097"), (() => {
      const resetWorkspaces = () => reset.current = stryMutAct_9fa48("7098") ? false : (stryCov_9fa48("7098"), true);

      return resetWorkspaces;
    })());
    const getWorkspaces = useCallback(async (name: string, page: string) => {
      if (stryMutAct_9fa48("7099")) {
        {}
      } else {
        stryCov_9fa48("7099");

        try {
          if (stryMutAct_9fa48("7100")) {
            {}
          } else {
            stryCov_9fa48("7100");
            setData(stryMutAct_9fa48("7101") ? {} : (stryCov_9fa48("7101"), { ...data,
              status: stryMutAct_9fa48("7102") ? "" : (stryCov_9fa48("7102"), 'pending')
            }));

            if (stryMutAct_9fa48("7104") ? false : stryMutAct_9fa48("7103") ? true : (stryCov_9fa48("7103", "7104"), isRoot())) {
              if (stryMutAct_9fa48("7105")) {
                {}
              } else {
                stryCov_9fa48("7105");
                const res = await findWorkspaces(stryMutAct_9fa48("7106") ? {} : (stryCov_9fa48("7106"), {
                  name,
                  page
                }));
                setData(stryMutAct_9fa48("7107") ? {} : (stryCov_9fa48("7107"), {
                  workspaces: reset.current ? res.content : stryMutAct_9fa48("7108") ? [] : (stryCov_9fa48("7108"), [...data.workspaces, ...res.content]),
                  last: res.last,
                  status: stryMutAct_9fa48("7109") ? "" : (stryCov_9fa48("7109"), 'resolved')
                }));
              }
            } else {
              if (stryMutAct_9fa48("7110")) {
                {}
              } else {
                stryCov_9fa48("7110");
                const userId = getProfileByKey(stryMutAct_9fa48("7111") ? "" : (stryCov_9fa48("7111"), 'id'));
                const res = await findWorkspacesByUser(userId, stryMutAct_9fa48("7112") ? {} : (stryCov_9fa48("7112"), {
                  name
                }));
                setData(stryMutAct_9fa48("7113") ? {} : (stryCov_9fa48("7113"), {
                  workspaces: reset.current ? res : stryMutAct_9fa48("7114") ? [] : (stryCov_9fa48("7114"), [...data.workspaces, ...res]),
                  last: stryMutAct_9fa48("7115") ? false : (stryCov_9fa48("7115"), true),
                  status: stryMutAct_9fa48("7116") ? "" : (stryCov_9fa48("7116"), 'resolved')
                }));
              }
            }

            reset.current = stryMutAct_9fa48("7117") ? true : (stryCov_9fa48("7117"), false);
          }
        } catch (e) {
          if (stryMutAct_9fa48("7118")) {
            {}
          } else {
            stryCov_9fa48("7118");
            setData(stryMutAct_9fa48("7119") ? {} : (stryCov_9fa48("7119"), { ...data,
              status: stryMutAct_9fa48("7120") ? "" : (stryCov_9fa48("7120"), 'rejected')
            }));
          }
        }
      }
    }, stryMutAct_9fa48("7121") ? [] : (stryCov_9fa48("7121"), [findWorkspaces, findWorkspacesByUser, data]));
    return stryMutAct_9fa48("7122") ? {} : (stryCov_9fa48("7122"), {
      getWorkspaces,
      resetWorkspaces,
      data
    });
  }
};
export const useSaveWorkspace = (): {
  save: Function;
  response: Workspace;
  error: Response;
  loading: boolean;
} => {
  if (stryMutAct_9fa48("7123")) {
    {}
  } else {
    stryCov_9fa48("7123");
    const [workspaceData, save] = useFetch<Workspace>(saveWorkspaceName);
    const dispatch = useDispatch();
    const {
      response,
      error,
      loading
    } = workspaceData;
    useEffect(() => {
      if (stryMutAct_9fa48("7124")) {
        {}
      } else {
        stryCov_9fa48("7124");

        (async () => {
          if (stryMutAct_9fa48("7125")) {
            {}
          } else {
            stryCov_9fa48("7125");

            if (stryMutAct_9fa48("7127") ? false : stryMutAct_9fa48("7126") ? true : (stryCov_9fa48("7126", "7127"), response)) {
              if (stryMutAct_9fa48("7128")) {
                {}
              } else {
                stryCov_9fa48("7128");
                saveWorkspace(response);
              }
            } else if (stryMutAct_9fa48("7130") ? false : stryMutAct_9fa48("7129") ? true : (stryCov_9fa48("7129", "7130"), error)) {
              if (stryMutAct_9fa48("7131")) {
                {}
              } else {
                stryCov_9fa48("7131");
                const e = await (stryMutAct_9fa48("7133") ? error.json?.() : stryMutAct_9fa48("7132") ? error?.json() : (stryCov_9fa48("7132", "7133"), error?.json?.()));
                dispatch(toogleNotification(stryMutAct_9fa48("7134") ? {} : (stryCov_9fa48("7134"), {
                  text: stryMutAct_9fa48("7135") ? `` : (stryCov_9fa48("7135"), `${error.status}: ${stryMutAct_9fa48("7136") ? e.message : (stryCov_9fa48("7136"), e?.message)}`),
                  status: stryMutAct_9fa48("7137") ? "" : (stryCov_9fa48("7137"), 'error')
                })));
              }
            }
          }
        })();
      }
    }, stryMutAct_9fa48("7138") ? [] : (stryCov_9fa48("7138"), [dispatch, error, response]));
    return stryMutAct_9fa48("7139") ? {} : (stryCov_9fa48("7139"), {
      save,
      response,
      error,
      loading
    });
  }
};