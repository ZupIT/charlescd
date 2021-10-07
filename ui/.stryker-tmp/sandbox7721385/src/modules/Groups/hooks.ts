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

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'core/state/hooks';
import { FetchStatuses, useFetch } from 'core/providers/base/hooks';
import { UserGroup } from './interfaces/UserGroups';
import { findAllUserGroup, findUserGroupById, saveUserGroup, updateUserGroup, deleteUserGroup, addMemberToUserGroup, removeMemberToUserGroup } from 'core/providers/user-group';
import { UserGroupPagination } from './interfaces/UserGroupsPagination';
import { loadUserGroupsAction, resetUserGroupsAction, updateUserGroupAction } from './state/actions';
import { UserPagination } from 'modules/Users/interfaces/UserPagination';
import { findAllUsers } from 'core/providers/users';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { addParamUserGroup } from './helpers';
import { useHistory } from 'react-router-dom';
import { FormAction } from '.';
export const useFindAllUserGroup = (): [Function, boolean, UserGroupPagination] => {
  if (stryMutAct_9fa48("4485")) {
    {}
  } else {
    stryCov_9fa48("4485");
    const dispatch = useDispatch();
    const [userGroupData, getUserGroups] = useFetch<UserGroupPagination>(findAllUserGroup);
    const {
      response,
      loading
    } = userGroupData;
    const loadUserGroupList = useCallback((name: string, page = 0) => {
      if (stryMutAct_9fa48("4486")) {
        {}
      } else {
        stryCov_9fa48("4486");
        getUserGroups(stryMutAct_9fa48("4487") ? {} : (stryCov_9fa48("4487"), {
          name,
          page
        }));
      }
    }, stryMutAct_9fa48("4488") ? [] : (stryCov_9fa48("4488"), [getUserGroups]));
    useEffect(() => {
      if (stryMutAct_9fa48("4489")) {
        {}
      } else {
        stryCov_9fa48("4489");

        if (stryMutAct_9fa48("4491") ? false : stryMutAct_9fa48("4490") ? true : (stryCov_9fa48("4490", "4491"), response)) {
          if (stryMutAct_9fa48("4492")) {
            {}
          } else {
            stryCov_9fa48("4492");
            dispatch(loadUserGroupsAction(response));
          }
        }
      }
    }, stryMutAct_9fa48("4493") ? [] : (stryCov_9fa48("4493"), [response, dispatch]));
    return stryMutAct_9fa48("4494") ? [] : (stryCov_9fa48("4494"), [loadUserGroupList, loading, response]);
  }
};
export const useFindUserGroupByID = (): [Function, UserGroup] => {
  if (stryMutAct_9fa48("4495")) {
    {}
  } else {
    stryCov_9fa48("4495");
    const [userGroupData, getUserGroup] = useFetch<UserGroup>(findUserGroupById);
    const {
      response
    } = userGroupData;
    const loadUserGroup = useCallback((id: string) => {
      if (stryMutAct_9fa48("4496")) {
        {}
      } else {
        stryCov_9fa48("4496");
        getUserGroup(id);
      }
    }, stryMutAct_9fa48("4497") ? [] : (stryCov_9fa48("4497"), [getUserGroup]));
    return stryMutAct_9fa48("4498") ? [] : (stryCov_9fa48("4498"), [loadUserGroup, response]);
  }
};
export const useListUser = (): [Function, UserPagination] => {
  if (stryMutAct_9fa48("4499")) {
    {}
  } else {
    stryCov_9fa48("4499");
    const [usersData, getUsers] = useFetch<UserPagination>(findAllUsers);
    const {
      response
    } = usersData;
    const loadUserList = useCallback((email: string) => {
      if (stryMutAct_9fa48("4500")) {
        {}
      } else {
        stryCov_9fa48("4500");
        getUsers(stryMutAct_9fa48("4501") ? {} : (stryCov_9fa48("4501"), {
          email
        }));
      }
    }, stryMutAct_9fa48("4502") ? [] : (stryCov_9fa48("4502"), [getUsers]));
    return stryMutAct_9fa48("4503") ? [] : (stryCov_9fa48("4503"), [loadUserList, response]);
  }
};
export const useCreateUserGroup = (): {
  createUserGroup: Function;
  loading: boolean;
  response: UserGroup;
} => {
  if (stryMutAct_9fa48("4504")) {
    {}
  } else {
    stryCov_9fa48("4504");
    const dispatch = useDispatch();
    const history = useHistory();
    const [getAllUserGroups,, userGroups] = useFindAllUserGroup();
    const [usersData, save] = useFetch<UserGroup>(saveUserGroup);
    const {
      response,
      loading
    } = usersData;
    const createUserGroup = useCallback((name: string) => {
      if (stryMutAct_9fa48("4505")) {
        {}
      } else {
        stryCov_9fa48("4505");
        save(stryMutAct_9fa48("4506") ? {} : (stryCov_9fa48("4506"), {
          name
        }));
      }
    }, stryMutAct_9fa48("4507") ? [] : (stryCov_9fa48("4507"), [save]));
    useEffect(() => {
      if (stryMutAct_9fa48("4508")) {
        {}
      } else {
        stryCov_9fa48("4508");

        if (stryMutAct_9fa48("4510") ? false : stryMutAct_9fa48("4509") ? true : (stryCov_9fa48("4509", "4510"), userGroups)) {
          if (stryMutAct_9fa48("4511")) {
            {}
          } else {
            stryCov_9fa48("4511");
            dispatch(resetUserGroupsAction());
            dispatch(loadUserGroupsAction(userGroups));
          }
        }
      }
    }, stryMutAct_9fa48("4512") ? [] : (stryCov_9fa48("4512"), [dispatch, userGroups]));
    useEffect(() => {
      if (stryMutAct_9fa48("4513")) {
        {}
      } else {
        stryCov_9fa48("4513");

        if (stryMutAct_9fa48("4515") ? false : stryMutAct_9fa48("4514") ? true : (stryCov_9fa48("4514", "4515"), response)) {
          if (stryMutAct_9fa48("4516")) {
            {}
          } else {
            stryCov_9fa48("4516");
            getAllUserGroups();
            addParamUserGroup(history, stryMutAct_9fa48("4517") ? `` : (stryCov_9fa48("4517"), `${stryMutAct_9fa48("4518") ? response.id : (stryCov_9fa48("4518"), response?.id)}~${FormAction.edit}`));
          }
        }
      }
    }, stryMutAct_9fa48("4519") ? [] : (stryCov_9fa48("4519"), [response, getAllUserGroups, history]));
    return stryMutAct_9fa48("4520") ? {} : (stryCov_9fa48("4520"), {
      createUserGroup,
      loading,
      response
    });
  }
};
export const useUpdateUserGroup = (): [Function, UserGroup, string] => {
  if (stryMutAct_9fa48("4521")) {
    {}
  } else {
    stryCov_9fa48("4521");
    const dispatch = useDispatch();
    const [data, update] = useFetch<UserGroup>(updateUserGroup);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("4522") ? "" : (stryCov_9fa48("4522"), 'idle'));
    const {
      response,
      error
    } = data;
    const doUpdateUserGroup = useCallback((id: string, name: string) => {
      if (stryMutAct_9fa48("4523")) {
        {}
      } else {
        stryCov_9fa48("4523");
        setStatus(stryMutAct_9fa48("4524") ? "" : (stryCov_9fa48("4524"), 'pending'));
        update(id, stryMutAct_9fa48("4525") ? {} : (stryCov_9fa48("4525"), {
          name
        }));
      }
    }, stryMutAct_9fa48("4526") ? [] : (stryCov_9fa48("4526"), [update]));
    useEffect(() => {
      if (stryMutAct_9fa48("4527")) {
        {}
      } else {
        stryCov_9fa48("4527");

        if (stryMutAct_9fa48("4529") ? false : stryMutAct_9fa48("4528") ? true : (stryCov_9fa48("4528", "4529"), response)) {
          if (stryMutAct_9fa48("4530")) {
            {}
          } else {
            stryCov_9fa48("4530");
            setStatus(stryMutAct_9fa48("4531") ? "" : (stryCov_9fa48("4531"), 'resolved'));
            dispatch(updateUserGroupAction(response));
          }
        }
      }
    }, stryMutAct_9fa48("4532") ? [] : (stryCov_9fa48("4532"), [dispatch, setStatus, response]));
    useEffect(() => {
      if (stryMutAct_9fa48("4533")) {
        {}
      } else {
        stryCov_9fa48("4533");

        if (stryMutAct_9fa48("4535") ? false : stryMutAct_9fa48("4534") ? true : (stryCov_9fa48("4534", "4535"), error)) {
          if (stryMutAct_9fa48("4536")) {
            {}
          } else {
            stryCov_9fa48("4536");
            setStatus(stryMutAct_9fa48("4537") ? "" : (stryCov_9fa48("4537"), 'rejected'));
          }
        }
      }
    }, stryMutAct_9fa48("4538") ? [] : (stryCov_9fa48("4538"), [setStatus, error]));
    return stryMutAct_9fa48("4539") ? [] : (stryCov_9fa48("4539"), [doUpdateUserGroup, response, status]);
  }
};
export const useDeleteUserGroup = (): [Function, UserGroup, boolean] => {
  if (stryMutAct_9fa48("4540")) {
    {}
  } else {
    stryCov_9fa48("4540");
    const dispatch = useDispatch();
    const [data, onDelete] = useFetch<UserGroup>(deleteUserGroup);
    const [getAllUserGroups,, userGroups] = useFindAllUserGroup();
    const [isFinished, setIsFinished] = useState(stryMutAct_9fa48("4541") ? true : (stryCov_9fa48("4541"), false));
    const {
      response,
      error
    } = data;
    const doDeleteUserGroup = useCallback((id: string) => {
      if (stryMutAct_9fa48("4542")) {
        {}
      } else {
        stryCov_9fa48("4542");
        onDelete(id);
      }
    }, stryMutAct_9fa48("4543") ? [] : (stryCov_9fa48("4543"), [onDelete]));
    useEffect(() => {
      if (stryMutAct_9fa48("4544")) {
        {}
      } else {
        stryCov_9fa48("4544");

        if (stryMutAct_9fa48("4546") ? false : stryMutAct_9fa48("4545") ? true : (stryCov_9fa48("4545", "4546"), response)) {
          if (stryMutAct_9fa48("4547")) {
            {}
          } else {
            stryCov_9fa48("4547");
            getAllUserGroups();
          }
        }
      }
    }, stryMutAct_9fa48("4548") ? [] : (stryCov_9fa48("4548"), [response, getAllUserGroups]));
    useEffect(() => {
      if (stryMutAct_9fa48("4549")) {
        {}
      } else {
        stryCov_9fa48("4549");

        if (stryMutAct_9fa48("4551") ? false : stryMutAct_9fa48("4550") ? true : (stryCov_9fa48("4550", "4551"), userGroups)) {
          if (stryMutAct_9fa48("4552")) {
            {}
          } else {
            stryCov_9fa48("4552");
            dispatch(resetUserGroupsAction());
            dispatch(loadUserGroupsAction(userGroups));
            setIsFinished(stryMutAct_9fa48("4553") ? false : (stryCov_9fa48("4553"), true));
          }
        }
      }
    }, stryMutAct_9fa48("4554") ? [] : (stryCov_9fa48("4554"), [dispatch, userGroups]));
    useEffect(() => {
      if (stryMutAct_9fa48("4555")) {
        {}
      } else {
        stryCov_9fa48("4555");

        if (stryMutAct_9fa48("4557") ? false : stryMutAct_9fa48("4556") ? true : (stryCov_9fa48("4556", "4557"), error)) {
          if (stryMutAct_9fa48("4558")) {
            {}
          } else {
            stryCov_9fa48("4558");
            dispatch(toogleNotification(stryMutAct_9fa48("4559") ? {} : (stryCov_9fa48("4559"), {
              text: stryMutAct_9fa48("4560") ? "" : (stryCov_9fa48("4560"), 'The user group could not be deleted.'),
              status: stryMutAct_9fa48("4561") ? "" : (stryCov_9fa48("4561"), 'error')
            })));
          }
        } else if (stryMutAct_9fa48("4563") ? false : stryMutAct_9fa48("4562") ? true : (stryCov_9fa48("4562", "4563"), response)) {
          if (stryMutAct_9fa48("4564")) {
            {}
          } else {
            stryCov_9fa48("4564");
            dispatch(toogleNotification(stryMutAct_9fa48("4565") ? {} : (stryCov_9fa48("4565"), {
              text: stryMutAct_9fa48("4566") ? "" : (stryCov_9fa48("4566"), 'The user group has been deleted.'),
              status: stryMutAct_9fa48("4567") ? "" : (stryCov_9fa48("4567"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("4568") ? [] : (stryCov_9fa48("4568"), [response, error, dispatch]));
    return stryMutAct_9fa48("4569") ? [] : (stryCov_9fa48("4569"), [doDeleteUserGroup, response, isFinished]);
  }
};
export const useManagerMemberInUserGroup = (): [Function, string] => {
  if (stryMutAct_9fa48("4570")) {
    {}
  } else {
    stryCov_9fa48("4570");
    const [,, onAddMemberUserGroup] = useFetch<UserGroup>(addMemberToUserGroup);
    const [,, onRemoveMemberUserGroup] = useFetch<UserGroup>(removeMemberToUserGroup);
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("4571") ? "" : (stryCov_9fa48("4571"), 'idle'));
    const managerMemberUserGroup = useCallback((checked: boolean, groupId: string, memberId: string) => {
      if (stryMutAct_9fa48("4572")) {
        {}
      } else {
        stryCov_9fa48("4572");
        setStatus(stryMutAct_9fa48("4573") ? "" : (stryCov_9fa48("4573"), 'pending'));

        if (stryMutAct_9fa48("4575") ? false : stryMutAct_9fa48("4574") ? true : (stryCov_9fa48("4574", "4575"), checked)) {
          if (stryMutAct_9fa48("4576")) {
            {}
          } else {
            stryCov_9fa48("4576");
            onAddMemberUserGroup(groupId, stryMutAct_9fa48("4577") ? {} : (stryCov_9fa48("4577"), {
              memberId
            })).then(() => {
              if (stryMutAct_9fa48("4578")) {
                {}
              } else {
                stryCov_9fa48("4578");
                setStatus(stryMutAct_9fa48("4579") ? "" : (stryCov_9fa48("4579"), 'resolved'));
              }
            }).catch(() => {
              if (stryMutAct_9fa48("4580")) {
                {}
              } else {
                stryCov_9fa48("4580");
                setStatus(stryMutAct_9fa48("4581") ? "" : (stryCov_9fa48("4581"), 'rejected'));
              }
            });
          }
        } else {
          if (stryMutAct_9fa48("4582")) {
            {}
          } else {
            stryCov_9fa48("4582");
            onRemoveMemberUserGroup(groupId, memberId).then(() => {
              if (stryMutAct_9fa48("4583")) {
                {}
              } else {
                stryCov_9fa48("4583");
                setStatus(stryMutAct_9fa48("4584") ? "" : (stryCov_9fa48("4584"), 'resolved'));
              }
            }).catch(() => {
              if (stryMutAct_9fa48("4585")) {
                {}
              } else {
                stryCov_9fa48("4585");
                setStatus(stryMutAct_9fa48("4586") ? "" : (stryCov_9fa48("4586"), 'rejected'));
              }
            });
          }
        }
      }
    }, stryMutAct_9fa48("4587") ? [] : (stryCov_9fa48("4587"), [onAddMemberUserGroup, onRemoveMemberUserGroup]));
    return stryMutAct_9fa48("4588") ? [] : (stryCov_9fa48("4588"), [managerMemberUserGroup, status]);
  }
};