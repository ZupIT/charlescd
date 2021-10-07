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

import { useCallback, useEffect, useState } from 'react';
import { create, detach, findByName, findAll } from 'core/providers/userGroup';
import { findAll as findAllRoles } from 'core/providers/roles';
import { addConfig } from 'core/providers/workspace';
import { useFetch, FetchProps, useFetchData, FetchStatuses } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';
import { UserGroup, GroupRoles, Role } from './interfaces';
import { ALREADY_ASSOCIATED_MESSAGE, ALREADY_ASSOCIATED_CODE } from './constants';
type DeleteUserGroup = {
  remove: (id: string, groupId: string) => Promise<Response>;
  status: FetchStatuses;
};
export const useDeleteUserGroup = (): DeleteUserGroup => {
  if (stryMutAct_9fa48("6195")) {
    {}
  } else {
    stryCov_9fa48("6195");
    const detachUserGroup = useFetchData<Response>(detach);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6196") ? "" : (stryCov_9fa48("6196"), "idle"));
    const dispatch = useDispatch();

    const remove = async (id: string, groupId: string) => {
      if (stryMutAct_9fa48("6197")) {
        {}
      } else {
        stryCov_9fa48("6197");

        try {
          if (stryMutAct_9fa48("6198")) {
            {}
          } else {
            stryCov_9fa48("6198");
            setStatus(stryMutAct_9fa48("6199") ? "" : (stryCov_9fa48("6199"), "pending"));
            const res = await detachUserGroup(id, groupId);
            setStatus(stryMutAct_9fa48("6200") ? "" : (stryCov_9fa48("6200"), "resolved"));
            dispatch(toogleNotification(stryMutAct_9fa48("6201") ? {} : (stryCov_9fa48("6201"), {
              text: stryMutAct_9fa48("6202") ? "" : (stryCov_9fa48("6202"), 'Success deleting user group'),
              status: stryMutAct_9fa48("6203") ? "" : (stryCov_9fa48("6203"), 'success')
            })));
            return res;
          }
        } catch (e) {
          if (stryMutAct_9fa48("6204")) {
            {}
          } else {
            stryCov_9fa48("6204");
            setStatus(stryMutAct_9fa48("6205") ? "" : (stryCov_9fa48("6205"), "rejected"));
            dispatch(toogleNotification(stryMutAct_9fa48("6206") ? {} : (stryCov_9fa48("6206"), {
              text: stryMutAct_9fa48("6207") ? `` : (stryCov_9fa48("6207"), `[${e.status}] User Group could not be removed.`),
              status: stryMutAct_9fa48("6208") ? "" : (stryCov_9fa48("6208"), 'error')
            })));
          }
        }
      }
    };

    return stryMutAct_9fa48("6209") ? {} : (stryCov_9fa48("6209"), {
      remove,
      status
    });
  }
};
export const useUserGroup = (): FetchProps => {
  if (stryMutAct_9fa48("6210")) {
    {}
  } else {
    stryCov_9fa48("6210");
    const dispatch = useDispatch();
    const [createData, createUserGroup] = useFetch<GroupRoles>(create);
    const findUserGroupByName = useFetchData<{
      content: UserGroup[];
    }>(findByName);
    const [userGroupsData, getUserGroups] = useFetch<{
      content: UserGroup[];
    }>(findAll);
    const [addData] = useFetch(addConfig);
    const [delData, detachGroup] = useFetch(detach);
    const {
      loading: loadingSave,
      response: responseSave,
      error: errorSave
    } = createData;
    const {
      loading: loadingAll,
      response,
      error
    } = userGroupsData;
    const {
      loading: loadingAdd,
      response: responseAdd
    } = addData;
    const {
      loading: loadingRemove,
      response: responseRemove,
      error: errorRemove
    } = delData;
    const save = useCallback((id: string, roleId: string) => {
      if (stryMutAct_9fa48("6211")) {
        {}
      } else {
        stryCov_9fa48("6211");
        createUserGroup(id, roleId);
      }
    }, stryMutAct_9fa48("6212") ? [] : (stryCov_9fa48("6212"), [createUserGroup]));
    useEffect(() => {
      if (stryMutAct_9fa48("6213")) {
        {}
      } else {
        stryCov_9fa48("6213");

        if (stryMutAct_9fa48("6215") ? false : stryMutAct_9fa48("6214") ? true : (stryCov_9fa48("6214", "6215"), errorSave)) {
          if (stryMutAct_9fa48("6216")) {
            {}
          } else {
            stryCov_9fa48("6216");

            (async () => {
              if (stryMutAct_9fa48("6217")) {
                {}
              } else {
                stryCov_9fa48("6217");
                const e = await errorSave.json();
                let code: string | number = ALREADY_ASSOCIATED_CODE;
                let message = ALREADY_ASSOCIATED_MESSAGE;

                if (stryMutAct_9fa48("6220") ? e?.code !== ALREADY_ASSOCIATED_CODE : stryMutAct_9fa48("6219") ? false : stryMutAct_9fa48("6218") ? true : (stryCov_9fa48("6218", "6219", "6220"), (stryMutAct_9fa48("6221") ? e.code : (stryCov_9fa48("6221"), e?.code)) === ALREADY_ASSOCIATED_CODE)) {
                  if (stryMutAct_9fa48("6222")) {
                    {}
                  } else {
                    stryCov_9fa48("6222");
                    code = 422;
                  }
                }

                if (stryMutAct_9fa48("6225") ? e?.message !== ALREADY_ASSOCIATED_MESSAGE : stryMutAct_9fa48("6224") ? false : stryMutAct_9fa48("6223") ? true : (stryCov_9fa48("6223", "6224", "6225"), (stryMutAct_9fa48("6226") ? e.message : (stryCov_9fa48("6226"), e?.message)) === ALREADY_ASSOCIATED_MESSAGE)) {
                  if (stryMutAct_9fa48("6227")) {
                    {}
                  } else {
                    stryCov_9fa48("6227");
                    message = stryMutAct_9fa48("6228") ? "" : (stryCov_9fa48("6228"), 'Group already associated to this workspace');
                  }
                }

                dispatch(toogleNotification(stryMutAct_9fa48("6229") ? {} : (stryCov_9fa48("6229"), {
                  text: stryMutAct_9fa48("6230") ? `` : (stryCov_9fa48("6230"), `[${code}] ${message}`),
                  status: stryMutAct_9fa48("6231") ? "" : (stryCov_9fa48("6231"), 'error')
                })));
              }
            })();
          }
        }
      }
    }, stryMutAct_9fa48("6232") ? [] : (stryCov_9fa48("6232"), [errorSave, dispatch]));
    const getAll = useCallback(() => {
      if (stryMutAct_9fa48("6233")) {
        {}
      } else {
        stryCov_9fa48("6233");
        getUserGroups();
      }
    }, stryMutAct_9fa48("6234") ? [] : (stryCov_9fa48("6234"), [getUserGroups]));
    useEffect(() => {
      if (stryMutAct_9fa48("6235")) {
        {}
      } else {
        stryCov_9fa48("6235");

        if (stryMutAct_9fa48("6237") ? false : stryMutAct_9fa48("6236") ? true : (stryCov_9fa48("6236", "6237"), error)) {
          if (stryMutAct_9fa48("6238")) {
            {}
          } else {
            stryCov_9fa48("6238");
            dispatch(toogleNotification(stryMutAct_9fa48("6239") ? {} : (stryCov_9fa48("6239"), {
              text: stryMutAct_9fa48("6240") ? `` : (stryCov_9fa48("6240"), `[${error.status}] User Group could not be fetched.`),
              status: stryMutAct_9fa48("6241") ? "" : (stryCov_9fa48("6241"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6242") ? [] : (stryCov_9fa48("6242"), [error, dispatch]));
    const remove = useCallback((id: string, groupId: string) => {
      if (stryMutAct_9fa48("6243")) {
        {}
      } else {
        stryCov_9fa48("6243");
        detachGroup(id, groupId);
      }
    }, stryMutAct_9fa48("6244") ? [] : (stryCov_9fa48("6244"), [detachGroup]));
    useEffect(() => {
      if (stryMutAct_9fa48("6245")) {
        {}
      } else {
        stryCov_9fa48("6245");

        if (stryMutAct_9fa48("6247") ? false : stryMutAct_9fa48("6246") ? true : (stryCov_9fa48("6246", "6247"), errorRemove)) {
          if (stryMutAct_9fa48("6248")) {
            {}
          } else {
            stryCov_9fa48("6248");
            dispatch(toogleNotification(stryMutAct_9fa48("6249") ? {} : (stryCov_9fa48("6249"), {
              text: stryMutAct_9fa48("6250") ? `` : (stryCov_9fa48("6250"), `[${errorRemove.status}] User Group could not be removed.`),
              status: stryMutAct_9fa48("6251") ? "" : (stryCov_9fa48("6251"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6252") ? [] : (stryCov_9fa48("6252"), [errorRemove, dispatch]));
    useEffect(() => {
      if (stryMutAct_9fa48("6253")) {
        {}
      } else {
        stryCov_9fa48("6253");

        if (stryMutAct_9fa48("6255") ? false : stryMutAct_9fa48("6254") ? true : (stryCov_9fa48("6254", "6255"), responseRemove)) {
          if (stryMutAct_9fa48("6256")) {
            {}
          } else {
            stryCov_9fa48("6256");
            dispatch(toogleNotification(stryMutAct_9fa48("6257") ? {} : (stryCov_9fa48("6257"), {
              text: stryMutAct_9fa48("6258") ? "" : (stryCov_9fa48("6258"), 'Success deleting user group'),
              status: stryMutAct_9fa48("6259") ? "" : (stryCov_9fa48("6259"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6260") ? [] : (stryCov_9fa48("6260"), [responseRemove, dispatch]));
    return stryMutAct_9fa48("6261") ? {} : (stryCov_9fa48("6261"), {
      getAll,
      findUserGroupByName,
      save,
      remove,
      responseAdd,
      responseAll: stryMutAct_9fa48("6262") ? response.content : (stryCov_9fa48("6262"), response?.content),
      responseSave,
      responseRemove,
      loadingAdd,
      loadingAll,
      loadingRemove,
      loadingSave
    });
  }
};
export const useRole = (): FetchProps => {
  if (stryMutAct_9fa48("6263")) {
    {}
  } else {
    stryCov_9fa48("6263");
    const [rolesData, getRoles] = useFetch<{
      content: Role[];
    }>(findAllRoles);
    const {
      loading: loadingAll,
      response
    } = rolesData;
    const getAll = useCallback(() => {
      if (stryMutAct_9fa48("6264")) {
        {}
      } else {
        stryCov_9fa48("6264");
        getRoles();
      }
    }, stryMutAct_9fa48("6265") ? [] : (stryCov_9fa48("6265"), [getRoles]));
    return stryMutAct_9fa48("6266") ? {} : (stryCov_9fa48("6266"), {
      getAll,
      loadingAll,
      responseAll: stryMutAct_9fa48("6267") ? response.content : (stryCov_9fa48("6267"), response?.content)
    });
  }
};