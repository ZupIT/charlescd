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

import { useCallback, useRef, useState } from 'react';
import { WorkspacePagination, WorkspacePaginationItem } from 'modules/Workspaces/interfaces/WorkspacePagination';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { findAll } from 'core/providers/workspace';


type WorkspaceResponse = {
  workspaces: WorkspacePaginationItem[],
  status: FetchStatuses,
  last: boolean,
}

export const useWorkspaces = (): {
  getWorkspaces: Function,
  resetWorkspaces: Function,
  data: WorkspaceResponse,
} => {
  const findWorkspaces = useFetchData<WorkspacePagination>(findAll);
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
        const res = await findWorkspaces({ name, page });
        setData({
          workspaces: reset.current
            ? res.content
            : [...data.workspaces, ...res.content],
          last: res.last,
          status: 'resolved'
        });

        reset.current = false;
      } catch (e) {
        setData({ ...data, status: 'rejected' });
      }
    }, [findWorkspaces, data]);

  return {
    getWorkspaces,
    resetWorkspaces,
    data
  }
};
