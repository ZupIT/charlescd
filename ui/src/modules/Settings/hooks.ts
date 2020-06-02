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

import { useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { findAll, findById, updateName } from 'core/providers/workspace';
import { useDispatch } from 'core/state/hooks';
import { loadedWorkspacesAction } from './state/actions';
import { WorkspacePagination } from './Workspaces/interfaces/WorkspacePagination';
import { Workspace } from './Workspaces/interfaces/Workspace';

export const useWorkspace = (): [
  Workspace,
  Function,
  Function,
  boolean,
  Function
] => {
  const [workspace, getWorkspace] = useFetch<Workspace>(findById);
  const [, updateWorkspace] = useFetch(updateName);
  const { loading, response } = workspace;

  const loadWorkspace = useCallback(
    (id: string) => {
      getWorkspace({ id });
    },
    [getWorkspace]
  );

  const update = useCallback(
    (name: string) => {
      updateWorkspace(name);
    },
    [updateWorkspace]
  );

  return [response, loadWorkspace, getWorkspace, loading, update];
};

export const useWorkspaces = (): [Function, Function] => {
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
      console.error(error);
    }
  }, [dispatch, response, error]);

  return [filerWorkspace, getWorkspaces];
};

export default useWorkspace;
