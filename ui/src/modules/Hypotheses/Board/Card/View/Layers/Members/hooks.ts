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

import { useCallback, useEffect } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { findAllWorkspaceUsers } from 'core/providers/users';
import { User } from 'modules/Users/interfaces/User';
import { UserPagination } from 'modules/Users/interfaces/UserPagination';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';

interface FetchProps {
  getAllUsers: Function;
  loadingUsers: boolean;
  users: User[];
}

export const useUsers = (): FetchProps => {
  const dispatch = useDispatch();
  const [usersData, getUsers] = useFetch<UserPagination>(findAllWorkspaceUsers);
  const { response, loading: loadingUsers, error } = usersData;

  const getAllUsers = useCallback(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `The users could not be fetched.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  return { getAllUsers, loadingUsers, users: response?.content };
};

export default useUsers;
