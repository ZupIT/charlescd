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
import { create, configPath } from 'core/providers/metricProvider';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { MetricProvider, Response } from './interfaces';

export const useMetricProvider = (): FetchProps => {
  const [createData, createMetricProvider] = useFetch<Response>(create);
  const [addData, addMetricProvider] = useFetch(addConfig);
  const [delData, delMetricProvider] = useFetch(delConfig);
  const { loading: loadingSave, response: responseSave } = createData;
  const { loading: loadingAdd, response: responseAdd } = addData;
  const { response: responseRemove } = delData;

  const save = useCallback(
    (metricProvider: MetricProvider) => {
      createMetricProvider(metricProvider);
    },
    [createMetricProvider]
  );

  useEffect(() => {
    if (responseSave) addMetricProvider(configPath, responseSave?.id);
  }, [addMetricProvider, responseSave]);

  const remove = useCallback(() => {
    delMetricProvider(configPath);
  }, [delMetricProvider]);

  return {
    responseAdd,
    save,
    responseRemove,
    remove,
    loadingSave,
    loadingAdd
  };
};
