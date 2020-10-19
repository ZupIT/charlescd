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
import { toogleNotification } from 'core/components/Notification/state/actions';
import { findAll, saveWorkspaceName } from 'core/providers/workspace';
import { useDispatch } from 'core/state/hooks';
import { loadedWorkspacesAction } from './state/actions';
import { WorkspacePagination } from './interfaces/WorkspacePagination';
import { Workspace } from './interfaces/Workspace';

export const useWorkspace = (): [Function, Function, boolean] => {
  const dispatch = useDispatch();
  const [workspacesData, getWorkspace] = useFetch<WorkspacePagination>(findAll);
  const { response, error, loading } = workspacesData;

  const filerWorkspace = useCallback(
    (name: string) => {
      getWorkspace({ name });
    },
    [getWorkspace]
  );

  useEffect(() => {
    if (!error) {
      dispatch(loadedWorkspacesAction(response));
    } else {
      console.error(error);
    }
  }, [dispatch, response, error]);

  return [filerWorkspace, getWorkspace, loading];
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
  }, [dispatch, error]);

  return { save, response, error, loading };
};
