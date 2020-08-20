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

import { useState } from 'react';
import {
  useFetchData,
  useFetchStatus,
  FetchStatus
} from 'core/providers/base/hooks';
import { getAllMetricsGroupById } from 'core/providers/groupMetrics';
import { GroupMetrics } from './interface';

export const useGroupMetrics = (): {
  getGroupMetrics: Function;
  groupMetrics: GroupMetrics[];
  status: FetchStatus;
} => {
  const getMetricsGroup = useFetchData<GroupMetrics[]>(getAllMetricsGroupById);
  const status = useFetchStatus();
  const [groupMetrics, setMetricsGroup] = useState(null);

  const getGroupMetrics = async (circleId: string) => {
    try {
      status.pending();
      const res = await getMetricsGroup(circleId);
      const [metricsGroup] = res;

      setMetricsGroup(metricsGroup);
      status.resolved();

      return metricsGroup;
    } catch (e) {
      status.rejected();
    }
  };

  return {
    getGroupMetrics,
    groupMetrics,
    status
  };
};
