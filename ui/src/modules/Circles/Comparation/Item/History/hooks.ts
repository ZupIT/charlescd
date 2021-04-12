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
import {
  useFetchData,
  useFetchStatus,
  FetchStatus
} from 'core/providers/base/hooks';
import { findDeployLogsByCircleId } from 'core/providers/deployment';

export const useCircleDeployLogs = (): {
  getCircleDeployLogs: Function;
  logs: any[];
  status: FetchStatus;
} => {
  const getCircleDeployLogsData = useFetchData<any[]>(
    findDeployLogsByCircleId
  );
  const status = useFetchStatus();
  const [logs, setLogs] = useState([]);

  const getCircleDeployLogs = useCallback(
    async (deploymentId: string) => {
      try {
        status.pending();
        const logsResponse = await getCircleDeployLogsData(deploymentId);

        setLogs(logsResponse);
        status.resolved();

        return logsResponse;
      } catch(e) {
        status.rejected();
      }
    },
    [getCircleDeployLogsData, status]
  );

  return {
    getCircleDeployLogs,
    logs,
    status
  };
};