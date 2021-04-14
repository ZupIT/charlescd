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

import { useCallback } from 'react';
import { 
  useFetch, 
  useFetchData
} from 'core/providers/base/hooks';
import { buildParams, URLParams } from 'core/utils/query';
import { 
  getDeployHistoryByCircleId,
  findDeployLogsByDeploymentId
} from 'core/providers/deployment';
import { CircleReleasesResponse } from 'modules/Metrics/Circles/interfaces';
import { CircleDeploymentLogs } from './types'

export const useCircleDeployHistory = () => {
  const [releasesData, getCircleData] = useFetch<CircleReleasesResponse>(
    getDeployHistoryByCircleId
  );
  const { response, loading } = releasesData;

  const getCircleReleases = useCallback(
    (params: URLParams, circleId: string) => {
      const urlParams = buildParams(params);
      getCircleData(urlParams, circleId);
    },
    [getCircleData]
  );

  return {
    getCircleReleases,
    response,
    loading
  };
};

export const useCircleDeployLogs = () => {
  const getLogsDataRequest = useFetchData<CircleDeploymentLogs[]>(findDeployLogsByDeploymentId);

  const getLogsData = useCallback(
    async (deploymentId: string) => {
      try {
        const logsResponseData = await getLogsDataRequest(deploymentId);

        return logsResponseData;
      
      } catch (e) {
        console.log(e);
      }
    }, [getLogsDataRequest]);

  return {
    getLogsData
  };
};
