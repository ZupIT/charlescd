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
import {
  getAllMetricsGroupsById,
  getMetricsGroupsResumeById,
  getAllMetricsProviders,
  saveMetric as saveMetricRequest,
  getAllDataSourceMetrics as getAllDataSourceMetricsRequest,
  saveMetricGroup
} from 'core/providers/metricsGroups';
import { buildParams, URLParams } from 'core/utils/query';
import {
  MetricsGroups,
  MetricsGroupsResume,
  Metric,
  DataSource
} from './types';

export const useMetricsGroupsResume = (): {
  getMetricsgroupsResume: Function;
  resume: MetricsGroupsResume[];
  status: FetchStatus;
} => {
  const getMetricsGroupsResumeData = useFetchData<MetricsGroupsResume[]>(
    getMetricsGroupsResumeById
  );
  const status = useFetchStatus();
  const [resume, setResume] = useState([]);

  const getMetricsgroupsResume = useCallback(
    async (payload: URLParams) => {
      try {
        status.pending();
        const params = buildParams(payload);
        const resumeResponse = await getMetricsGroupsResumeData(params);

        setResume(resumeResponse);
        status.resolved();

        return resumeResponse;
      } catch (e) {
        status.rejected();
      }
    },
    [getMetricsGroupsResumeData, status]
  );

  return {
    getMetricsgroupsResume,
    resume,
    status
  };
};

export const useMetricsGroups = (): {
  getMetricsGroups: Function;
  metricsGroups: MetricsGroups[];
  status: FetchStatus;
} => {
  const getMetricsGroupData = useFetchData<MetricsGroups[]>(
    getAllMetricsGroupsById
  );
  const status = useFetchStatus();
  const [metricsGroups, setMetricsGroups] = useState([]);

  const getMetricsGroups = useCallback(
    async (circleId: string) => {
      try {
        status.pending();
        const metricsGroupsResponse = await getMetricsGroupData(circleId);

        setMetricsGroups(metricsGroupsResponse);
        status.resolved();

        return metricsGroupsResponse;
      } catch (e) {
        status.rejected();
      }
    },
    [getMetricsGroupData, status]
  );

  return {
    getMetricsGroups,
    metricsGroups,
    status
  };
};

export const useMetricProviders = () => {
  const getMetricProvidersData = useFetchData<DataSource[]>(
    getAllMetricsProviders
  );
  const status = useFetchStatus();
  const [providers, setProviders] = useState([]);

  const getMetricsProviders = useCallback(async () => {
    try {
      status.pending();
      const providersResponse = await getMetricProvidersData();

      setProviders(providersResponse);
      status.resolved();

      return providersResponse;
    } catch (e) {
      status.rejected();
    }
  }, [getMetricProvidersData, status]);

  return {
    getMetricsProviders,
    providers,
    status
  };
};

export const useSaveMetric = () => {
  const saveMetricPayload = useFetchData<Metric>(saveMetricRequest);
  const status = useFetchStatus();

  const saveMetric = useCallback(
    async (metricsGroupsId: string, metricPayload: Metric) => {
      try {
        status.pending();
        const savedMetricResponse = await saveMetricPayload(
          metricsGroupsId,
          metricPayload
        );

        status.resolved();

        return savedMetricResponse;
      } catch (e) {
        status.rejected();
      }
    },
    [saveMetricPayload, status]
  );

  return {
    saveMetric,
    status
  };
};

export const useProviderMetrics = () => {
  const getAllDataSourceMetricsData = useFetchData<string[]>(
    getAllDataSourceMetricsRequest
  );
  const status = useFetchStatus();
  const [dataSourceMetrics, setDataSourceMetrics] = useState([]);

  const getAllDataSourceMetrics = useCallback(
    async (datasourceId: string) => {
      try {
        status.pending();
        const response = await getAllDataSourceMetricsData(datasourceId);

        setDataSourceMetrics(response);
        status.resolved();

        return response;
      } catch (e) {
        status.rejected();
      }
    },
    [getAllDataSourceMetricsData, status]
  );

  return {
    getAllDataSourceMetrics,
    dataSourceMetrics,
    status
  };
};

export const useCreateMetricsGroup = () => {
  const createMetricsGroupPayload = useFetchData<MetricsGroups>(
    saveMetricGroup
  );
  const status = useFetchStatus();

  const createMetricsGroup = useCallback(
    async (name: string, circleId: string) => {
      try {
        status.pending();
        const createdMetricsGroupResponse = await createMetricsGroupPayload({
          name,
          circleId
        });

        status.resolved();

        return createdMetricsGroupResponse;
      } catch (e) {
        status.rejected();
      }
    },
    [createMetricsGroupPayload, status]
  );

  return {
    createMetricsGroup,
    status
  };
};
