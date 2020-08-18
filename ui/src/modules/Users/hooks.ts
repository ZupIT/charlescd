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
  FetchStatus
} from 'core/providers/base/hooks';
import {
  findAllUsers,
  updateProfileById,
  findUserByEmail,
  createNewUser,
  deleteUserById
} from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { LoadedUsersAction } from './state/actions';
import { UserPagination } from './interfaces/UserPagination';
import { User, Profile, NewUser } from './interfaces/User';

export const useUser = (): [User, boolean, Function] => {
  const [userData, getUser] = useFetch<User>(findUserByEmail);
  const { response, loading } = userData;

  const loadUser = useCallback(
    (email: string) => {
      getUser(email);
    },
    [getUser]
  );

  return [response, loading, loadUser];
};

export const useCreateUser = (): {
  create: Function;
  newUser: User;
  status: FetchStatus;
} => {
  const dispatch = useDispatch();
  const createUser = useFetchData<NewUser>(createNewUser);
  const status = useFetchStatus();
  const [newUser, setNewUser] = useState(null);

  const create = async (user: NewUser) => {
    try {
      if (user) {
        status.pending();
        const res = await createUser(user);

        setNewUser(res);
        status.resolved();

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

      status.rejected();
    }
  };

  return {
    create,
    newUser,
    status
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

export const useUpdateProfile = (): [
  boolean,
  boolean,
  Function,
  User,
  string
] => {
  const [, profileLoading] = useUser();
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

  return [profileLoading, updateLoading, updateProfile, response, status];
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
