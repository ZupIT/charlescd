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
import { getAllMetricsGroupsById } from 'core/providers/metricsGroups';
import { MetricsGroups } from './interface';

export const useMetricsGroups = (): {
  getMetricsGroups: Function;
  metricsGroups: MetricsGroups[];
  status: FetchStatus;
} => {
  const getMetricsGroupData = useFetchData<MetricsGroups[]>(
    getAllMetricsGroupsById
  );
  const status = useFetchStatus();
  const [metricsGroups, setMetricsGroups] = useState(null);

  const getMetricsGroups = useCallback(
    async (circleId: string) => {
      try {
        status.pending();
        const res = await getMetricsGroupData(circleId);
        const [metricsGroups] = res;

        setMetricsGroups(metricsGroups);
        status.resolved();

        return metricsGroups;
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
