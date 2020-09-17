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

import { useEffect, useCallback, useState } from 'react';
import {
  useFetch,
  useFetchData,
  useFetchStatus,
  FetchStatus,
  ResponseError
} from 'core/providers/base/hooks';
import {
  findAllUsers,
  resetPasswordById,
  updateProfileById,
  findUserByEmail,
  createNewUser,
  deleteUserById
} from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { LoadedUsersAction } from './state/actions';
import { UserPagination } from './interfaces/UserPagination';
import { User, Profile, NewUser, NewPassword } from './interfaces/User';

export const useUser = (): {
  findByEmail: Function;
  user: User;
  error: ResponseError;
} => {
  const dispatch = useDispatch();
  const getUserByEmail = useFetchData<User>(findUserByEmail);
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<ResponseError>(null);

  const findByEmail = useCallback(
    async (email: Pick<User, 'email'>) => {
      try {
        if (email) {
          const res = await getUserByEmail(email);

          setUser(res);

          return res;
        }
      } catch (e) {
        setError(e);

        dispatch(
          toogleNotification({
            text: `Error when trying to fetch the user info for ${email}`,
            status: 'error'
          })
        );
      }
    },
    [dispatch, getUserByEmail]
  );

  return {
    findByEmail,
    user,
    error
  };
};

export const useCreateUser = (): {
  create: Function;
  newUser: User;
} => {
  const dispatch = useDispatch();
  const createUser = useFetchData<NewUser>(createNewUser);
  const [newUser, setNewUser] = useState(null);

  const create = useCallback(
    async (user: NewUser) => {
      try {
        if (user) {
          const res = await createUser(user);

          setNewUser(res);

          return res;
        }
      } catch (e) {
        const error = await e.json();

        dispatch(
          toogleNotification({
            text: error.message,
            status: 'error'
          })
        );
      }
    },
    [createUser, dispatch]
  );

  return {
    create,
    newUser
  };
};

export const useDeleteUser = (): [Function, string] => {
  const [deleteData, deleteUser] = useFetch<User>(deleteUserById);
  const [userName, setUserName] = useState(undefined);
  const [userStatus, setUserStatus] = useState('');
  const { response, error } = deleteData;
  const dispatch = useDispatch();

  const delUser = useCallback(
    (id: string, name: string) => {
      setUserName(name);
      deleteUser(id);
    },
    [deleteUser]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `The user ${userName} could not be deleted.`,
          status: 'error'
        })
      );
    } else if (response) {
      setUserStatus('Deleted');
      dispatch(
        toogleNotification({
          text: `The user ${userName} has been deleted.`,
          status: 'success'
        })
      );
    }
  }, [response, error, dispatch, userName]);

  return [delUser, userStatus];
};

export const useUpdateProfile = (): [boolean, Function, User, string] => {
  const [status, setStatus] = useState<string>('');
  const [dataUpdate, , update] = useFetch<User>(updateProfileById);
  const { response, loading: updateLoading } = dataUpdate;

  const updateProfile = useCallback(
    (id: string, profile: Profile) => {
      setStatus('');
      update(id, profile).then(() => setStatus('resolved'));
    },
    [update]
  );

  return [updateLoading, updateProfile, response, status];
};

export const useResetPassword = (): {
  resetPassword: (id: string) => void;
  response: NewPassword;
  status: FetchStatus;
} => {
  const dispatch = useDispatch();
  const status = useFetchStatus();
  const [response, setResponse] = useState<NewPassword>();
  const putResetPassword = useFetchData<NewPassword>(resetPasswordById);

  const resetPassword = async (id: string) => {
    try {
      status.pending();
      const putResponse = await putResetPassword(id);
      setResponse(putResponse);
      status.resolved();
    } catch (e) {
      dispatch(
        toogleNotification({
          text: 'The password could not be reset.',
          status: 'error'
        })
      );

      status.rejected();
    }
  };

  return { resetPassword, response, status };
};

export const useUsers = (): [Function, Function, boolean] => {
  const dispatch = useDispatch();
  const [usersData, getUsers] = useFetch<UserPagination>(findAllUsers);
  const { response, error, loading } = usersData;

  const getAll = useCallback(
    (name: string) => {
      getUsers({ name });
    },
    [getUsers]
  );

  useEffect(() => {
    if (!error) {
      dispatch(LoadedUsersAction(response));
    } else {
      console.error(error);
    }
  }, [dispatch, response, error]);

  return [getAll, getUsers, loading];
};

export default useUsers;
