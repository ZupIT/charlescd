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

import { useEffect, useCallback, useState } from 'react';
import { useFetch, useFetchData, useFetchStatus, FetchStatus, ResponseError, FetchStatuses } from 'core/providers/base/hooks';
import { findAllUsers, resetPasswordById, patchProfileById, findUserByEmail, createNewUser, deleteUserById } from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { LoadedUsersAction } from './state/actions';
import { UserPagination } from './interfaces/UserPagination';
import { User, NewUser, NewPassword } from './interfaces/User';
import { isIDMEnabled } from 'core/utils/auth';
export const useUser = (): {
  findByEmail: Function;
  user: User;
  error: ResponseError;
} => {
  if (stryMutAct_9fa48("6817")) {
    {}
  } else {
    stryCov_9fa48("6817");
    const dispatch = useDispatch();
    const getUserByEmail = useFetchData<User>(findUserByEmail);
    const [user, setUser] = useState<User>(null);
    const [error, setError] = useState<ResponseError>(null);
    const findByEmail = useCallback(async (email: Pick<User, 'email'>) => {
      if (stryMutAct_9fa48("6818")) {
        {}
      } else {
        stryCov_9fa48("6818");

        try {
          if (stryMutAct_9fa48("6819")) {
            {}
          } else {
            stryCov_9fa48("6819");

            if (stryMutAct_9fa48("6821") ? false : stryMutAct_9fa48("6820") ? true : (stryCov_9fa48("6820", "6821"), email)) {
              if (stryMutAct_9fa48("6822")) {
                {}
              } else {
                stryCov_9fa48("6822");
                const res = await getUserByEmail(email);
                setUser(res);
                return res;
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("6823")) {
            {}
          } else {
            stryCov_9fa48("6823");
            setError(e);

            if (stryMutAct_9fa48("6826") ? false : stryMutAct_9fa48("6825") ? true : stryMutAct_9fa48("6824") ? isIDMEnabled() : (stryCov_9fa48("6824", "6825", "6826"), !isIDMEnabled())) {
              if (stryMutAct_9fa48("6827")) {
                {}
              } else {
                stryCov_9fa48("6827");
                dispatch(toogleNotification(stryMutAct_9fa48("6828") ? {} : (stryCov_9fa48("6828"), {
                  text: stryMutAct_9fa48("6829") ? `` : (stryCov_9fa48("6829"), `Error when trying to fetch the user info for ${email}`),
                  status: stryMutAct_9fa48("6830") ? "" : (stryCov_9fa48("6830"), 'error')
                })));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("6831") ? [] : (stryCov_9fa48("6831"), [dispatch, getUserByEmail]));
    return stryMutAct_9fa48("6832") ? {} : (stryCov_9fa48("6832"), {
      findByEmail,
      user,
      error
    });
  }
};
export const useCreateUser = (): {
  create: Function;
  newUser: User;
} => {
  if (stryMutAct_9fa48("6833")) {
    {}
  } else {
    stryCov_9fa48("6833");
    const dispatch = useDispatch();
    const createUser = useFetchData<NewUser>(createNewUser);
    const [newUser, setNewUser] = useState(null);
    const create = useCallback(async (user: NewUser) => {
      if (stryMutAct_9fa48("6834")) {
        {}
      } else {
        stryCov_9fa48("6834");

        try {
          if (stryMutAct_9fa48("6835")) {
            {}
          } else {
            stryCov_9fa48("6835");

            if (stryMutAct_9fa48("6837") ? false : stryMutAct_9fa48("6836") ? true : (stryCov_9fa48("6836", "6837"), user)) {
              if (stryMutAct_9fa48("6838")) {
                {}
              } else {
                stryCov_9fa48("6838");
                const res = await createUser(user);
                setNewUser(res);
                return res;
              }
            }
          }
        } catch (e) {
          if (stryMutAct_9fa48("6839")) {
            {}
          } else {
            stryCov_9fa48("6839");
            const error = await e.json();
            dispatch(toogleNotification(stryMutAct_9fa48("6840") ? {} : (stryCov_9fa48("6840"), {
              text: error.message,
              status: stryMutAct_9fa48("6841") ? "" : (stryCov_9fa48("6841"), 'error')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6842") ? [] : (stryCov_9fa48("6842"), [createUser, dispatch]));
    return stryMutAct_9fa48("6843") ? {} : (stryCov_9fa48("6843"), {
      create,
      newUser
    });
  }
};
export const useDeleteUser = (): [Function, string] => {
  if (stryMutAct_9fa48("6844")) {
    {}
  } else {
    stryCov_9fa48("6844");
    const [deleteData, deleteUser] = useFetch<User>(deleteUserById);
    const [userName, setUserName] = useState(undefined);
    const [userStatus, setUserStatus] = useState(stryMutAct_9fa48("6845") ? "Stryker was here!" : (stryCov_9fa48("6845"), ''));
    const {
      response,
      error
    } = deleteData;
    const dispatch = useDispatch();
    const delUser = useCallback((id: string, name: string) => {
      if (stryMutAct_9fa48("6846")) {
        {}
      } else {
        stryCov_9fa48("6846");
        setUserName(name);
        deleteUser(id);
      }
    }, stryMutAct_9fa48("6847") ? [] : (stryCov_9fa48("6847"), [deleteUser]));
    useEffect(() => {
      if (stryMutAct_9fa48("6848")) {
        {}
      } else {
        stryCov_9fa48("6848");

        if (stryMutAct_9fa48("6850") ? false : stryMutAct_9fa48("6849") ? true : (stryCov_9fa48("6849", "6850"), error)) {
          if (stryMutAct_9fa48("6851")) {
            {}
          } else {
            stryCov_9fa48("6851");
            dispatch(toogleNotification(stryMutAct_9fa48("6852") ? {} : (stryCov_9fa48("6852"), {
              text: stryMutAct_9fa48("6853") ? `` : (stryCov_9fa48("6853"), `The user ${userName} could not be deleted.`),
              status: stryMutAct_9fa48("6854") ? "" : (stryCov_9fa48("6854"), 'error')
            })));
          }
        } else if (stryMutAct_9fa48("6856") ? false : stryMutAct_9fa48("6855") ? true : (stryCov_9fa48("6855", "6856"), response)) {
          if (stryMutAct_9fa48("6857")) {
            {}
          } else {
            stryCov_9fa48("6857");
            setUserStatus(stryMutAct_9fa48("6858") ? "" : (stryCov_9fa48("6858"), 'Deleted'));
            dispatch(toogleNotification(stryMutAct_9fa48("6859") ? {} : (stryCov_9fa48("6859"), {
              text: stryMutAct_9fa48("6860") ? `` : (stryCov_9fa48("6860"), `The user ${userName} has been deleted.`),
              status: stryMutAct_9fa48("6861") ? "" : (stryCov_9fa48("6861"), 'success')
            })));
          }
        }
      }
    }, stryMutAct_9fa48("6862") ? [] : (stryCov_9fa48("6862"), [response, error, dispatch, userName]));
    return stryMutAct_9fa48("6863") ? [] : (stryCov_9fa48("6863"), [delUser, userStatus]);
  }
};
export const useUpdateName = (): {
  status: string;
  user: User;
  updateNameById: (id: string, name: string) => Promise<User>;
} => {
  if (stryMutAct_9fa48("6864")) {
    {}
  } else {
    stryCov_9fa48("6864");
    const dispatch = useDispatch();
    const [status, setStatus] = useState<FetchStatuses>(stryMutAct_9fa48("6865") ? "" : (stryCov_9fa48("6865"), 'idle'));
    const [user, setNewUser] = useState<User>();
    const patch = useFetchData<User>(patchProfileById);
    const updateNameById = useCallback(async (id: string, name: string) => {
      if (stryMutAct_9fa48("6866")) {
        {}
      } else {
        stryCov_9fa48("6866");

        try {
          if (stryMutAct_9fa48("6867")) {
            {}
          } else {
            stryCov_9fa48("6867");
            setStatus(stryMutAct_9fa48("6868") ? "" : (stryCov_9fa48("6868"), 'pending'));
            const res = await patch(id, name);
            setNewUser(res);
            setStatus(stryMutAct_9fa48("6869") ? "" : (stryCov_9fa48("6869"), 'resolved'));
            return Promise.resolve(res);
          }
        } catch (e) {
          if (stryMutAct_9fa48("6870")) {
            {}
          } else {
            stryCov_9fa48("6870");
            setStatus(stryMutAct_9fa48("6871") ? "" : (stryCov_9fa48("6871"), 'rejected'));
            const error = await (stryMutAct_9fa48("6873") ? e.json?.() : stryMutAct_9fa48("6872") ? e?.json() : (stryCov_9fa48("6872", "6873"), e?.json?.()));
            dispatch(toogleNotification(stryMutAct_9fa48("6874") ? {} : (stryCov_9fa48("6874"), {
              text: stryMutAct_9fa48("6875") ? error.message : (stryCov_9fa48("6875"), error?.message),
              status: stryMutAct_9fa48("6876") ? "" : (stryCov_9fa48("6876"), 'error')
            })));
            return Promise.reject(error);
          }
        }
      }
    }, stryMutAct_9fa48("6877") ? [] : (stryCov_9fa48("6877"), [patch, dispatch]));
    return stryMutAct_9fa48("6878") ? {} : (stryCov_9fa48("6878"), {
      status,
      user,
      updateNameById
    });
  }
};
export const useResetPassword = (): {
  resetPassword: (id: string) => void;
  response: NewPassword;
  status: FetchStatus;
} => {
  if (stryMutAct_9fa48("6879")) {
    {}
  } else {
    stryCov_9fa48("6879");
    const dispatch = useDispatch();
    const status = useFetchStatus();
    const [response, setResponse] = useState<NewPassword>();
    const putResetPassword = useFetchData<NewPassword>(resetPasswordById);

    const resetPassword = async (id: string) => {
      if (stryMutAct_9fa48("6880")) {
        {}
      } else {
        stryCov_9fa48("6880");

        try {
          if (stryMutAct_9fa48("6881")) {
            {}
          } else {
            stryCov_9fa48("6881");
            status.pending();
            const putResponse = await putResetPassword(id);
            setResponse(putResponse);
            status.resolved();
          }
        } catch (e) {
          if (stryMutAct_9fa48("6882")) {
            {}
          } else {
            stryCov_9fa48("6882");
            const error = await e.json();
            dispatch(toogleNotification(stryMutAct_9fa48("6883") ? {} : (stryCov_9fa48("6883"), {
              text: stryMutAct_9fa48("6884") ? error.message : (stryCov_9fa48("6884"), error?.message),
              status: stryMutAct_9fa48("6885") ? "" : (stryCov_9fa48("6885"), 'error')
            })));
            status.rejected();
          }
        }
      }
    };

    return stryMutAct_9fa48("6886") ? {} : (stryCov_9fa48("6886"), {
      resetPassword,
      response,
      status
    });
  }
};
export const useUsers = (): [Function, UserPagination, boolean] => {
  if (stryMutAct_9fa48("6887")) {
    {}
  } else {
    stryCov_9fa48("6887");
    const dispatch = useDispatch();
    const [usersData, getUsers] = useFetch<UserPagination>(findAllUsers);
    const {
      response,
      error,
      loading
    } = usersData;
    const filterUsers = useCallback((name: string, page: number) => {
      if (stryMutAct_9fa48("6888")) {
        {}
      } else {
        stryCov_9fa48("6888");
        getUsers(stryMutAct_9fa48("6889") ? {} : (stryCov_9fa48("6889"), {
          name,
          page
        }));
      }
    }, stryMutAct_9fa48("6890") ? [] : (stryCov_9fa48("6890"), [getUsers]));
    useEffect(() => {
      if (stryMutAct_9fa48("6891")) {
        {}
      } else {
        stryCov_9fa48("6891");

        if (stryMutAct_9fa48("6894") ? false : stryMutAct_9fa48("6893") ? true : stryMutAct_9fa48("6892") ? error : (stryCov_9fa48("6892", "6893", "6894"), !error)) {
          if (stryMutAct_9fa48("6895")) {
            {}
          } else {
            stryCov_9fa48("6895");
            dispatch(LoadedUsersAction(response));
          }
        } else {
          if (stryMutAct_9fa48("6896")) {
            {}
          } else {
            stryCov_9fa48("6896");
            console.error(error);
          }
        }
      }
    }, stryMutAct_9fa48("6897") ? [] : (stryCov_9fa48("6897"), [dispatch, response, error]));
    return stryMutAct_9fa48("6898") ? [] : (stryCov_9fa48("6898"), [filterUsers, response, loading]);
  }
};
export default useUsers;