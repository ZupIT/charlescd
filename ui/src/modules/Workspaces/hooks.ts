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
import { FetchStatuses, useFetch, useFetchData } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { findAll, saveWorkspaceName } from 'core/providers/workspace';
import { findWorkspacesByUserId } from 'core/providers/users';
import { useDispatch } from 'core/state/hooks';
import { WorkspacePagination } from './interfaces/WorkspacePagination';
import { Workspace } from './interfaces/Workspace';
import { isRoot } from 'core/utils/auth';
import { getProfileByKey } from 'core/utils/profile';

export const useWorkspaces = (): {
  getWorkspaces: Function,
  workspaces: Workspace[],
  status: FetchStatuses
} => {
  const findWorkspaces = useFetchData<WorkspacePagination>(findAll);
  const findWorkspacesByUser = useFetchData<Workspace[]>(findWorkspacesByUserId);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(null);
  const [status, setStatus] = useState<FetchStatuses>('idle');

  const getWorkspaces = useCallback(
    async (name: string) => {
      try {
        setStatus('pending');
        if (isRoot()) {
          const res = await findWorkspaces({ name });
          setWorkspaces(res?.content);

        } else {
          const userId = getProfileByKey('id');
          const res = await findWorkspacesByUser(userId, { name });
          setWorkspaces(res);

        }
        setStatus('resolved');
      }
      catch (e) {
        setStatus('rejected');
      }

    }, [findWorkspaces, findWorkspacesByUser]);
  
  return {
    getWorkspaces,
    workspaces,
    status
  }
};

export const useSaveWorkspace = (): {
  save: Function;
  response: Workspace;
  error: Response;
  loading: boolean;
} => {
  const [workspaceData, save] = useFetch<Workspace>(saveWorkspaceName);
  const dispatch = useDispatch();
  const { response, error, loading } = workspaceData;

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `${error.status}: ${error.statusText}`,
          status: 'error'
        })
      );
    }
  }, [dispatch, error, response]);

  return { save, response, error, loading };
};
