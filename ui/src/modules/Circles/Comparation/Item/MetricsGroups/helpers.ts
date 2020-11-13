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

import { OptionTypeBase } from 'react-select';
import map from 'lodash/map';
import { conditionOptions, operatorsOptions } from './constants';
import { Option } from 'core/components/Form/Select/interfaces';
import { getWorkspaceId } from 'core/utils/workspace';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import filter from 'lodash/filter';
import { ActionForm } from './AddAction';
import {
  MetricsGroup,
  ChartDataByQuery,
  Data,
  ChartData,
  ActionType
} from './types';

export const normalizeMetricOptions = (metrics: string[]) =>
  map(metrics, item => ({
    label: item,
    value: item
  }));

export const getCondition = (condition: string) =>
  conditionOptions.find(({ value }) => condition === value);

export const getOperator = (operator: string) =>
  operatorsOptions.find(({ value }) => operator === value);

export const getSelectDefaultValue = (id: string, options: Option[]) =>
  find(options, { value: id });

export const getThresholdStatus = (status: string) => {
  switch (status) {
    case 'REACHED': {
      return {
        icon: 'bell',
        color: 'reached',
        message: 'This metric has reached its goal.',
        ResumeMessage: 'This metrics group has reached its goal.'
      };
    }
    case 'ERROR': {
      return {
        icon: 'error',
        color: 'error',
        message: 'An error occurred in this metric.',
        ResumeMessage: 'There is at least one error in your metrics group.'
      };
    }
    default: {
      return {
        icon: 'bell',
        color: 'active',
        message: 'This metric has not yet reached its goal.',
        ResumeMessage: 'This metrics group has not yet reached its goal.'
      };
    }
  }
};

const buildSeriesData = (data: Data[]) =>
  map(data, item => ({
    x: item.period * 1000,
    y: item.total
  }));

export const getMetricSeries = (data: ChartDataByQuery) =>
  map(data, item => ({
    name: item.metric,
    data: buildSeriesData(item.result)
  }));

export const filterMetricsSeries = (
  data: ChartData[],
  selectFilters: OptionTypeBase[]
) => {
  if (isUndefined(selectFilters) || selectFilters[0]?.value === '*') {
    return data;
  }

  const filteredData = filter(data, item => {
    return find(
      selectFilters,
      (filterItem: OptionTypeBase) => filterItem.label === item.name
    );
  });

  return filteredData as ChartData[];
};

export const createCirclePromotionPayload = (
  data: ActionForm,
  circleId: string
) => {
  return {
    destinationCircleId: data.circleId,
    originCircleId: circleId,
    workspaceId: getWorkspaceId()
  };
};

export const createActionPayload = (
  data: ActionForm,
  metricsGroup: MetricsGroup,
  circleId: string,
  selectedAction: string
) => {
  const { actionId, nickname } = data;

  const payloadByAction = {
    circledeployment: () => createCirclePromotionPayload(data, circleId)
  } as Record<string, Function>;

  return {
    metricsGroupId: metricsGroup.id,
    actionId,
    nickname,
    executionParameters: payloadByAction[selectedAction]()
  };
};

export const normalizeActionsOptions = (actionsType: ActionType[]) => {
  return map(actionsType, actionType => ({
    ...actionType,
    value: actionType.id,
    label: actionType.nickname,
    description: actionType.description
  }));
};
