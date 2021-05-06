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

type WorkspaceResponse = {
  workspaces: Workspace[],
  status: FetchStatuses,
  last: boolean
}

export const useWorkspaces = (): {
  getWorkspaces: Function,
  resetWorkspaces: Function,
  data: WorkspaceResponse,
} => {
  const findWorkspaces = useFetchData<WorkspacePagination>(findAll);
  const findWorkspacesByUser = useFetchData<Workspace[]>(findWorkspacesByUserId);
  const reset = useRef<boolean>(false);
  const [data, setData] = useState<WorkspaceResponse>({
    workspaces: [],
    status: 'idle',
    last: true
  });

  const resetWorkspaces = () => reset.current = true;

  const getWorkspaces = useCallback(
    async (name: string, page: string) => {
      try {
        setData({ ...data, status: 'pending' });

        if (isRoot()) {
          const res = await findWorkspaces({ name, page });
          setData({
            workspaces: reset.current
              ? res.content
              : [...data.workspaces, ...res.content],
            last: res.last,
            status: 'resolved'
          });

        } else {
          const userId = getProfileByKey('id');
          const res = await findWorkspacesByUser(userId, { name });
          setData({
            workspaces: reset.current ? res : [...data.workspaces, ...res],
            last: true,
            status: 'resolved'
          });
        }

        reset.current = false;

      }
      catch (e) {
        setData({ ...data, status: 'rejected' });
      
      }

    }, [findWorkspaces, findWorkspacesByUser, data]);
  
  return {
    getWorkspaces,
    resetWorkspaces,
    data
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
    (async () => {
      if (error) {
        const e = await error.json();
        dispatch(
          toogleNotification({
            text: `${error.status}: ${e?.message}`,
            status: 'error'
          })
        );
      }
    })();
  }, [dispatch, error, response]);

  return { save, response, error, loading };
};
