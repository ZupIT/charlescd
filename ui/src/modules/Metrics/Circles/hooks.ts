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
  findAllCirclesMetrics,
  findAllCirclesHistory,
  findAllCirclesReleases
} from 'core/providers/metrics';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import {
  CirclesMetricData,
  CircleRelease,
  CirclesHistoryResponse
} from './interfaces';
import { buildParams, URLParams } from 'core/utils/query';

interface CirclesMetrics extends FetchProps {
  findAllCirclesData: Function;
  response: CirclesMetricData;
}

export const useCircles = (): CirclesMetrics => {
  const [circlesData, getCircleData] = useFetch<CirclesMetricData>(
    findAllCirclesMetrics
  );
  const { response, loading } = circlesData;

  const findAllCirclesData = useCallback(() => {
    getCircleData();
  }, [getCircleData]);

  return {
    findAllCirclesData,
    response,
    loading
  };
};

interface CirclesHistory extends FetchProps {
  findCirclesHistory: Function;
  response: CirclesMetricData;
}

export const useCirclesHistory = () => {
  const [circlesData, getCircleData] = useFetch<CirclesHistoryResponse>(
    findAllCirclesHistory
  );
  const { response, loading } = circlesData;

  const getCirclesHistory = useCallback(
    (payload: URLParams) => {
      const params = buildParams(payload);
      getCircleData(params);
    },
    [getCircleData]
  );

  return {
    getCirclesHistory,
    response,
    loading
  };
};

export const useCirclesReleases = () => {
  const [releasesData, getCircleData] = useFetch<CircleRelease[]>(
    findAllCirclesReleases
  );
  const { response: releases, loading } = releasesData;

  const getCircleReleases = useCallback(
    (circleId: string) => {
      getCircleData(circleId);
    },
    [getCircleData]
  );

  return {
    getCircleReleases,
    releases,
    loading
  };
};
