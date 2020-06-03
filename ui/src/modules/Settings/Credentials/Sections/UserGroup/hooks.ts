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
import { create, detach, findAll } from 'core/providers/userGroup';
import { findAll as findAllRoles } from 'core/providers/roles';
import { addConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';
import { UserGroup, GroupRoles, Role } from './interfaces';

export const useUserGroup = (): FetchProps => {
  const dispatch = useDispatch();
  const [createData, createUserGroup] = useFetch<GroupRoles>(create);
  const [userGroupsData, getUserGroups] = useFetch<{ content: UserGroup[] }>(
    findAll
  );
  const [addData] = useFetch(addConfig);
  const [delData, detachGroup] = useFetch(detach);
  const {
    loading: loadingSave,
    response: responseSave,
    error: errorSave
  } = createData;
  const { loading: loadingAll, response, error } = userGroupsData;
  const { loading: loadingAdd, response: responseAdd } = addData;
  const {
    loading: loadingRemove,
    response: responseRemove,
    error: errorRemove
  } = delData;

  const save = useCallback(
    (id: string, roleId: string) => {
      createUserGroup(id, roleId);
    },
    [createUserGroup]
  );

  useEffect(() => {
    if (errorSave) {
      dispatch(
        toogleNotification({
          text: `[${errorSave.status}] User Group could not be saved.`,
          status: 'error'
        })
      );
    }
  }, [errorSave, dispatch]);

  const getAll = useCallback(() => {
    getUserGroups();
  }, [getUserGroups]);

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `[${error.status}] User Group could not be fetched.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  const remove = useCallback(
    (id: string, groupId: string) => {
      detachGroup(id, groupId);
    },
    [detachGroup]
  );

  useEffect(() => {
    if (errorRemove) {
      dispatch(
        toogleNotification({
          text: `[${errorRemove.status}] User Group could not be removed.`,
          status: 'error'
        })
      );
    }
  }, [errorRemove, dispatch]);

  return {
    getAll,
    save,
    remove,
    responseAdd,
    responseAll: response?.content,
    responseSave,
    responseRemove,
    loadingAdd,
    loadingAll,
    loadingRemove,
    loadingSave
  };
};

export const useRole = (): FetchProps => {
  const [rolesData, getRoles] = useFetch<{ content: Role[] }>(findAllRoles);
  const { loading: loadingAll, response } = rolesData;

  const getAll = useCallback(() => {
    getRoles();
  }, [getRoles]);

  return {
    getAll,
    loadingAll,
    responseAll: response?.content
  };
};
