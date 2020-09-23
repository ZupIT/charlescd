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
  OptionsValues,
  ThresholdStatusResponse,
  dataForMetricsSeriesTests,
  dataFormatted
} from './fixtures'; 
import { 
  normalizeMetricOptions,
  getCondition,
  getOperator,
  getSelectDefaultValue,
  getThresholdStatus,
  getDeploySeries
} from '../helpers';

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
  expect(getSelectDefaultValue('1', OptionsValues)).toEqual(OptionsValues[0]);
  expect(getSelectDefaultValue('2', OptionsValues)).not.toEqual(OptionsValues[0]);
});

test('must get Threshold Status text', () => {
  expect(getThresholdStatus('REACHED')).toEqual(ThresholdStatusResponse[0]);
  expect(getThresholdStatus('ERROR')).toEqual(ThresholdStatusResponse[1]);
  expect(getThresholdStatus(' ')).toEqual(ThresholdStatusResponse[2]);
});

test('must format Deploy Series', () => {
  expect(getDeploySeries(dataForMetricsSeriesTests)).toEqual(dataFormatted);
});
