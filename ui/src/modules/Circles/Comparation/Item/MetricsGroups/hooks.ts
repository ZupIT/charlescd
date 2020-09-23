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
  createMetric,
  updateMetric,
  getAllDataSourceMetrics as getAllDataSourceMetricsRequest,
  saveMetricGroup,
  deleteMetricGroup,
  deleteMetricByMetricId,
  getChartDataByQuery
} from 'core/providers/metricsGroups';
import { buildParams, URLParams } from 'core/utils/query';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import {
  MetricsGroup,
  MetricsGroupsResume,
  Metric,
  DataSource,
  ChartDataByQuery
} from './types';
import { ValidationError } from 'core/interfaces/ValidationError';

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
  metricsGroups: MetricsGroup[];
  status: FetchStatus;
} => {
  const getMetricsGroupData = useFetchData<MetricsGroup[]>(
    getAllMetricsGroupsById
  );
  const status = useFetchStatus();
  const [metricsGroups, setMetricsGroups] = useState<MetricsGroup[]>([]);

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
  const [providers, setProviders] = useState([]);

  const getMetricsProviders = useCallback(async () => {
    try {
      const providersResponse = await getMetricProvidersData();

      setProviders(providersResponse);

      return providersResponse;
    } catch (e) {
      console.log(e);
    }
  }, [getMetricProvidersData]);

  return {
    getMetricsProviders,
    providers
  };
};

export const useSaveMetric = (metricId: string) => {
  const saveRequest = metricId ? updateMetric : createMetric;
  const saveMetricPayload = useFetchData<Metric>(saveRequest);
  const status = useFetchStatus();
  const [validationError, setValidationError] = useState<ValidationError>();

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
      } catch (error) {
        status.rejected();
        error.text().then((errorMessage: string) => {
          const parsedError = JSON.parse(errorMessage);
          setValidationError(parsedError);
        });
      }
    },
    [saveMetricPayload, status]
  );

  return {
    saveMetric,
    status,
    validationError
  };
};

export const useProviderMetrics = () => {
  const getAllDataSourceMetricsData = useFetchData<string[]>(
    getAllDataSourceMetricsRequest
  );

  const getAllDataSourceMetrics = useCallback(
    async (datasourceId: string) => {
      try {
        const response = await getAllDataSourceMetricsData(datasourceId);

        return response;
      } catch (e) {
        console.log(e);
      }
    },
    [getAllDataSourceMetricsData]
  );

  return {
    getAllDataSourceMetrics
  };
};

export const useCreateMetricsGroup = () => {
  const createMetricsGroupPayload = useFetchData<MetricsGroup>(saveMetricGroup);
  const status = useFetchStatus();
  const dispatch = useDispatch();

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
      } catch (error) {
        status.rejected();
        error.text().then((errorMessage: any) => {
          const parsedError = JSON.parse(errorMessage);
          dispatch(
            toogleNotification({
              text:
                parsedError?.[0].message ?? 'Error on creating metric group',
              status: 'error'
            })
          );
        });
      }
    },
    [createMetricsGroupPayload, status, dispatch]
  );

  return {
    createMetricsGroup,
    status
  };
};

export const useDeleteMetricsGroup = () => {
  const deleteMetricsGroupRequest = useFetchData<MetricsGroup>(
    deleteMetricGroup
  );
  const dispatch = useDispatch();

  const deleteMetricsGroup = useCallback(
    async (metricsGroupId: string) => {
      try {
        const deleteMetricsGroupResponse = await deleteMetricsGroupRequest(
          metricsGroupId
        );

        dispatch(
          toogleNotification({
            text: `Success deleting metrics group`,
            status: 'success'
          })
        );

        return deleteMetricsGroupResponse;
      } catch (e) {
        dispatch(
          toogleNotification({
            text: `Error deleting metrics group`,
            status: 'error'
          })
        );
      }
    },
    [deleteMetricsGroupRequest, dispatch]
  );

  return {
    deleteMetricsGroup
  };
};

export const useDeleteMetric = () => {
  const deleteMetricRequest = useFetchData<MetricsGroup>(
    deleteMetricByMetricId
  );
  const dispatch = useDispatch();

  const deleteMetric = useCallback(
    async (metricsGroupId: string, metricId: string) => {
      try {
        const deleteMetricResponse = await deleteMetricRequest(
          metricsGroupId,
          metricId
        );

        dispatch(
          toogleNotification({
            text: `Success deleting metric`,
            status: 'success'
          })
        );

        return deleteMetricResponse;
      } catch (e) {
        dispatch(
          toogleNotification({
            text: `Error metric delete`,
            status: 'error'
          })
        );
      }
    },
    [deleteMetricRequest, dispatch]
  );

  return {
    deleteMetric
  };
};

export const useMetricQuery = () => {
  const getMetricByQueryRequest = useFetchData<ChartDataByQuery>(
    getChartDataByQuery
  );
  const dispatch = useDispatch();

  const getMetricByQuery = useCallback(
    async (metricsGroupId: string, payload: URLParams) => {
      try {
        const params = buildParams(payload);
        const metricByQueryResponse = await getMetricByQueryRequest(
          metricsGroupId,
          params
        );

        return metricByQueryResponse;
      } catch (error) {
        error.text().then((errorMessage: string) => {
          const parsedError = JSON.parse(errorMessage);
          dispatch(
            toogleNotification({
              text:
                parsedError?.[0].message ??
                'Error on loaging metric chart data',
              status: 'error'
            })
          );
        });
      }
    },
    [getMetricByQueryRequest, dispatch]
  );

  return {
    getMetricByQuery
  };
};
