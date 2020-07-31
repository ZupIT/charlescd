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

import { useCallback, useEffect } from 'react';
import {
  create,
  configPath,
  verifyProviderConnection,
  metricProviderConfigConnection
} from 'core/providers/metricProvider';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { MetricProvider, Response, TestConnectionResponse } from './interfaces';
import { buildParams, URLParams } from 'core/utils/query';
import { toogleNotification } from 'core/components/Notification/state/actions';

export const useMetricProvider = (): FetchProps => {
  const dispatch = useDispatch();
  const [createData, createMetricProvider] = useFetch<Response>(create);
  const [addData, addMetricProvider] = useFetch(addConfig);
  const [delData, delMetricProvider] = useFetch(delConfig);
  const {
    loading: loadingSave,
    response: responseSave,
    error: errorSave
  } = createData;
  const {
    loading: loadingAdd,
    response: responseAdd,
    error: errorAdd
  } = addData;
  const { response: responseRemove, error: errorRemove } = delData;

  const save = useCallback(
    (metricProvider: MetricProvider) => {
      createMetricProvider(metricProvider);
    },
    [createMetricProvider]
  );

  useEffect(() => {
    if (responseSave) addMetricProvider(configPath, responseSave?.id);
  }, [addMetricProvider, responseSave]);

  useEffect(() => {
    if (errorSave) {
      dispatch(
        toogleNotification({
          text: `[${errorSave.status}] Circle Matcher could not be saved.`,
          status: 'error'
        })
      );
    } else if (errorAdd) {
      dispatch(
        toogleNotification({
          text: `[${errorAdd.status}] Circle Matcher could not be patched.`,
          status: 'error'
        })
      );
    }
  }, [errorSave, errorAdd, dispatch]);

  const remove = useCallback(() => {
    delMetricProvider(configPath);
  }, [delMetricProvider]);

  useEffect(() => {
    if (errorRemove) {
      dispatch(
        toogleNotification({
          text: `[${errorRemove.status}] Metrics Provider could not be removed.`,
          status: 'error'
        })
      );
    }
  }, [errorRemove, dispatch]);

  return {
    responseAdd,
    save,
    responseRemove,
    remove,
    loadingSave,
    loadingAdd
  };
};

interface FromTestConnection extends FetchProps {
  testProviderConnectionForm: Function;
  response: TestConnectionResponse;
}

export const useFromTestConnection = (): FromTestConnection => {
  const [fromTestConnection, dispatchFormTestConnection] = useFetch<
    TestConnectionResponse
  >(verifyProviderConnection);

  const { response, loading } = fromTestConnection;

  const testProviderConnectionForm = useCallback(
    (payload: URLParams) => {
      const params = buildParams(payload);
      dispatchFormTestConnection(params);
    },
    [dispatchFormTestConnection]
  );

  return {
    testProviderConnectionForm,
    response,
    loading
  };
};

interface SectionTestConnection extends FetchProps {
  testProviderConnectionSection: Function;
  response: TestConnectionResponse;
}

export const useSectionTestConnection = (): SectionTestConnection => {
  const [sectionTestConnection, dispatchSectionTestConnection] = useFetch<
    TestConnectionResponse
  >(metricProviderConfigConnection);

  const { response, loading } = sectionTestConnection;

  const testProviderConnectionSection = useCallback(
    (params: URLParams, workspaceId: string) => {
      const urlParams = buildParams(params);
      dispatchSectionTestConnection(urlParams, workspaceId);
    },
    [dispatchSectionTestConnection]
  );

  return {
    testProviderConnectionSection,
    response,
    loading
  };
};
