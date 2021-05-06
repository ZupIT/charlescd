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

import { useState, useCallback } from 'react';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { findById, updateName } from 'core/providers/workspace';
import { useDispatch } from 'core/state/hooks';
import { Workspace } from './Workspaces/interfaces/Workspace';
import { toogleNotification } from 'core/components/Notification/state/actions';

type WorkspasceResponse = {
  workspace: Workspace,
  status: FetchStatuses
};

export const useWorkspace = (): { getWorkspace: Function, data: WorkspasceResponse } => {
  const getWorkspaceById = useFetchData<Workspace>(findById);
  const [data, setData] = useState<WorkspasceResponse>({ workspace: null, status: 'idle' });
  const dispatch = useDispatch();

  const getWorkspace = useCallback(
    async (id: string) => {
      setData({ ...data, status: 'pending' });
      try {
        const workspace = await getWorkspaceById({ id });
        setData({ workspace, status: 'resolved' });

      } catch (error) {
        if (error.status !== 403) {
          setData({ ...data, status: 'rejected' });
          dispatch(
            toogleNotification({
              text: `[${error.status}] Could not list`,
              status: 'error'
            })
          );
        }
      }
    },
    [getWorkspaceById, dispatch, data]
  );

  return {
    getWorkspace,
    data
  };
};

export const useWorkspaceUpdateName = () => {
  const updateWorkspace = useFetchData(updateName);
  const dispatch = useDispatch();

  const updateWorkspaceName = useCallback(
    async (name: string) => {
      try {
        await updateWorkspace(name);
      } catch (error) {
        dispatch(
          toogleNotification({
            text: `[${error.status}] Could not update`,
            status: 'error'
          })
        );
      }
    },
    [updateWorkspace, dispatch]
  );

  return {
    updateWorkspaceName
  }
};

export default useWorkspace;
