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
import { findDeployMetrics, findAllReleases } from 'core/providers/metrics';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import {
  DeployMetricData,
  ReleaseHistoryResponse,
  ReleaseHistoryRequest
} from './interfaces';
import { buildParams, URLParams } from 'core/utils/query';

interface DeployMetric extends FetchProps {
  searchDeployMetrics: Function;
  response: DeployMetricData;
}

export const useDeployMetric = (): DeployMetric => {
  const [deployData, searchDeployData] = useFetch<DeployMetricData>(
    findDeployMetrics
  );
  const { response, loading } = deployData;

  const searchDeployMetrics = useCallback(
    (payload: URLParams) => {
      const params = buildParams(payload);
      searchDeployData(params);
    },
    [searchDeployData]
  );

  return {
    searchDeployMetrics,
    response,
    loading
  };
};

export const useReleaseHistory = () => {
  const [releaseData, getReleaseData] = useFetch<ReleaseHistoryResponse>(
    findAllReleases
  );
  const { response, loading } = releaseData;

  const getReleaseHistory = useCallback(
    (payload: URLParams, releaseHistory: ReleaseHistoryRequest) => {
      const params = buildParams(payload);
      getReleaseData(params, releaseHistory);
    },
    [getReleaseData]
  );

  return {
    getReleaseHistory,
    response,
    loading
  };
};
