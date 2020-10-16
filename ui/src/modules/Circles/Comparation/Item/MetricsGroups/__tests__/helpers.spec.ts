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

import { 
  optionsValues,
  thresholdStatusResponse,
  dataForMetricsSeriesTests,
  dataFormatted,
  allSelect, 
  someIsSelect,
  dataFormattedAndFilter,
  actionForm,
  metricGroupItem,
  actionsType,
  actionType
} from './fixtures'; 
import { 
  normalizeMetricOptions,
  getCondition,
  getOperator,
  getSelectDefaultValue,
  getThresholdStatus,
  getMetricSeries,
  filterMetricsSeries,
  createCirclePromotionPayload,
  createActionPayload,
  normalizeActionsOptions
} from '../helpers';
import { ActionForm } from '../AddAction';
import * as workspaceUtils from 'core/utils/workspace';

test('must normalized metrics options', () => {
  expect(normalizeMetricOptions(["1","2"])).toEqual([{"label": "1", "value": "1"},{"label": "2", "value": "2"}]);
});

test('must get condition', () => {
  expect(getCondition('EQUAL')).toEqual({"label": "Equal", "value": "EQUAL"});
  expect(getCondition('GREATER_THAN')).toEqual({"label": "Greater than", "value": "GREATER_THAN"});
  expect(getCondition('LOWER_THAN')).toEqual({"label": "Lower than", "value": "LOWER_THAN"});
});

test('must get Operator', () => {
  expect(getOperator('=')).toEqual({"label": "Equal", "value": "="});
  expect(getOperator('!=')).toEqual({"label": "Different", "value": "!="});
  expect(getOperator('!~')).toEqual({"label": "Regex", "value": "!~"});
});

test('must get Select Default Value', () => {
  expect(getSelectDefaultValue('1', optionsValues)).toEqual(optionsValues[0]);
  expect(getSelectDefaultValue('2', optionsValues)).not.toEqual(optionsValues[0]);
});

test('must get Threshold Status text', () => {
  expect(getThresholdStatus('REACHED')).toEqual(thresholdStatusResponse[0]);
  expect(getThresholdStatus('ERROR')).toEqual(thresholdStatusResponse[1]);
  expect(getThresholdStatus(' ')).toEqual(thresholdStatusResponse[2]);
});

test('must format Metric Series', () => {
  expect(getMetricSeries(dataForMetricsSeriesTests)).toEqual(dataFormatted);
});

test('must filter Metric Series', () => {
  expect(filterMetricsSeries(dataFormatted, [])).toEqual([]);
  expect(filterMetricsSeries(dataFormatted, undefined)).toEqual(dataFormatted);
  expect(filterMetricsSeries(dataFormatted, allSelect)).toEqual(dataFormatted);
  expect(filterMetricsSeries(dataFormatted, someIsSelect)).toEqual(dataFormattedAndFilter);
});

test('must create CirclePromotionPayload', () => {
  const circleId = '2';
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue('3');

  const payload = createCirclePromotionPayload(actionForm, circleId);

  expect(payload).toMatchObject({
    destinationCircleId: '4',
    originCircleId: '2',
    workspaceId: '3'
  })
});

test('must create Action payload', () => {
  const payload = createActionPayload(actionForm, metricGroupItem, '2', 'circledeployment');

  const expected = {
    metricsGroupId: metricGroupItem.id,
    actionId: actionForm.actionId,
    nickname: actionForm.nickname,
    executionParameters: {
      destinationCircleId: '4',
      originCircleId: '2',
      workspaceId: '3'
    }
  }

  expect(payload).toMatchObject(expected);
});

test('must normalize Actions options', () => {
  const options = normalizeActionsOptions(actionsType);

  const expected = [
    {
      ...actionType,
      value: actionType.id,
      label: actionType.nickname,
      description: actionType.description
    }
  ]

  expect(options).toMatchObject(expected);
});