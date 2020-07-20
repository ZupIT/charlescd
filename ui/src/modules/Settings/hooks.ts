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

import { useState, useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { findAll, findById, updateName } from 'core/providers/workspace';
import { useDispatch } from 'core/state/hooks';
import { loadedWorkspacesAction } from './state/actions';
import { WorkspacePagination } from './Workspaces/interfaces/WorkspacePagination';
import { Workspace } from './Workspaces/interfaces/Workspace';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { checkStatus } from 'core/utils/auth';

export const useWorkspace = (): [
  Workspace,
  Function,
  Function,
  boolean,
  Function
] => {
  const [workspace, getWorkspace] = useFetch<Workspace>(findById);
  const [, , updateWorkspace] = useFetch(updateName);
  const { loading, response } = workspace;
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const loadWorkspace = useCallback(
    (id: string) => {
      getWorkspace({ id });
    },
    [getWorkspace]
  );

  const update = useCallback(
    async (name: string) => {
      try {
        await updateWorkspace(name);
        setData({ ...data, name });
      } catch (error) {
        dispatch(
          toogleNotification({
            text: `[${error.status}] Could not update`,
            status: 'error'
          })
        );
      }
    },
    [updateWorkspace, data, dispatch]
  );

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return [data, loadWorkspace, getWorkspace, loading, update];
};

export const useWorkspaces = (): [Function, Function, WorkspacePagination] => {
  const dispatch = useDispatch();
  const [workspaces, getWorkspaces] = useFetch<WorkspacePagination>(findAll);
  const { response, error } = workspaces;

  const filerWorkspace = useCallback(
    (name: string) => {
      getWorkspaces({ name });
    },
    [getWorkspaces]
  );

  useEffect(() => {
    if (!error) {
      dispatch(loadedWorkspacesAction(response));
    } else {
      checkStatus(error.status);
    }
  }, [dispatch, response, error]);

  return [filerWorkspace, getWorkspaces, response];
};

export default useWorkspace;
