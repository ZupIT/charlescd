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

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'core/state/hooks';
import {
  FetchStatus,
  FetchStatuses,
  useFetch,
  useFetchData,
  useFetchStatus
} from 'core/providers/base/hooks';
import { UserGroup } from './interfaces/UserGroups';
import {
  findAllUserGroup,
  findUserGroupById,
  saveUserGroup,
  updateUserGroup,
  deleteUserGroup,
  addMemberToUserGroup,
  removeMemberToUserGroup
} from 'core/providers/user-group';
import { UserGroupPagination } from './interfaces/UserGroupsPagination';
import { listUserGroupsAction } from './state/actions';
import { UserPagination } from 'modules/Users/interfaces/UserPagination';
import { findAllUsers } from 'core/providers/users';
import { toogleNotification } from 'core/components/Notification/state/actions';

export const useFindAllUserGroup = (): [
  Function,
  boolean,
  UserGroupPagination
] => {
  const dispatch = useDispatch();
  const [userGroupData, getUserGroups] = useFetch<UserGroupPagination>(
    findAllUserGroup
  );
  const { response, loading } = userGroupData;

  const loadUserGroupList = useCallback(
    (name: string) => {
      getUserGroups({ name });
    },
    [getUserGroups]
  );

  useEffect(() => {
    if (response) {
      dispatch(listUserGroupsAction(response));
    }
  }, [response, dispatch]);

  return [loadUserGroupList, loading, response];
};

export const useFindUserGroupByID = (): [Function, UserGroup] => {
  const [userGroupData, getUserGroup] = useFetch<UserGroup>(findUserGroupById);
  const { response } = userGroupData;

  const loadUserGroup = useCallback(
    (id: string) => {
      getUserGroup(id);
    },
    [getUserGroup]
  );

  return [loadUserGroup, response];
};

export const useListUser = (): [Function, UserPagination] => {
  const [usersData, getUsers] = useFetch<UserPagination>(findAllUsers);
  const { response } = usersData;

  const loadUserList = useCallback(
    (email: string) => {
      getUsers({ email });
    },
    [getUsers]
  );

  return [loadUserList, response];
};

export const useCreateUserGroup = (): {
  createUserGroup: (name: string) => Promise<UserGroup>;
  response: UserGroup;
  status: FetchStatus;
} => {
  const dispatch = useDispatch();
  const status = useFetchStatus();
  const [response, setResponse] = useState<UserGroup>();
  const save = useFetchData<UserGroup>(saveUserGroup);

  const createUserGroup = async (name: string) => {
    try {
      status.pending();
      const data = await save({ name, authorId: getProfileByKey('id') });
      setResponse(data);
      status.resolved();

      return data;
    } catch (e) {
      const error = await e.json();

  const createUserGroup = useCallback(
    (name: string) => {
      save({ name });
    },
    [save]
  );
      dispatch(
        toogleNotification({
          text: error?.message,
          status: 'error'
        })
      );

      status.rejected();
    }
  };

  return { createUserGroup, response, status };
};

export const useUpdateUserGroup = (): [Function, UserGroup, string] => {
  const [data, update] = useFetch<UserGroup>(updateUserGroup);
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const { response, error } = data;

  const doUpdateUserGroup = useCallback(
    (id: string, name: string) => {
      setStatus('pending');
      update(id, { name });
    },
    [update]
  );

  useEffect(() => {
    if (response) {
      setStatus('resolved');
    }
  }, [setStatus, response]);

  useEffect(() => {
    if (error) {
      setStatus('rejected');
    }
  }, [setStatus, error]);

  return [doUpdateUserGroup, response, status];
};

export const useDeleteUserGroup = (): [Function, UserGroup, boolean] => {
  const dispatch = useDispatch();
  const [data, onDelete] = useFetch<UserGroup>(deleteUserGroup);
  const [getAllUserGroups, , userGroups] = useFindAllUserGroup();
  const [isFinished, setIsFinished] = useState(false);
  const { response, error } = data;

  const doDeleteUserGroup = useCallback(
    (id: string) => {
      onDelete(id);
    },
    [onDelete]
  );

  useEffect(() => {
    if (response) {
      getAllUserGroups();
    }
  }, [response, getAllUserGroups]);

  useEffect(() => {
    if (userGroups) {
      setIsFinished(true);
    }
  }, [userGroups]);

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: 'The user group could not be deleted.',
          status: 'error'
        })
      );
    } else if (response) {
      dispatch(
        toogleNotification({
          text: 'The user group has been deleted.',
          status: 'success'
        })
      );
    }
  }, [response, error, dispatch]);

  return [doDeleteUserGroup, response, isFinished];
};

export const useManagerMemberInUserGroup = (): [Function, string] => {
  const [, , onAddMemberUserGroup] = useFetch<UserGroup>(addMemberToUserGroup);
  const [, , onRemoveMemberUserGroup] = useFetch<UserGroup>(
    removeMemberToUserGroup
  );
  const [status, setStatus] = useState<FetchStatuses>('idle');

  const managerMemberUserGroup = useCallback(
    (checked: boolean, groupId: string, memberId: string) => {
      setStatus('pending');
      if (checked) {
        onAddMemberUserGroup(groupId, { memberId })
          .then(() => {
            setStatus('resolved');
          })
          .catch(() => {
            setStatus('rejected');
          });
      } else {
        onRemoveMemberUserGroup(groupId, memberId)
          .then(() => {
            setStatus('resolved');
          })
          .catch(() => {
            setStatus('rejected');
          });
      }
    },
    [onAddMemberUserGroup, onRemoveMemberUserGroup]
  );

  return [managerMemberUserGroup, status];
};
