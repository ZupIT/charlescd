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

import React from 'react';
import { render, wait, waitForDomChange } from 'unit-test/testUtils';
import { COLOR_WHITE } from 'core/assets/colors';
import * as MetricEnums from '../enums';
import CircleMetrics from '../index';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('render circle metrics component', async () => {
  const id = 'circle-id';
  const testId = `circle-metric-${id}`;

  const { getByTestId } = render(
    <CircleMetrics
      id={id}
      chartType={MetricEnums.CHART_TYPE.NORMAL}
      metricType={MetricEnums.METRICS_TYPE.REQUESTS_BY_CIRCLE}
    />
  );

  await wait(() => expect(getByTestId(testId)).toBeInTheDocument());
});

test('filter circle metrics to 30m', async () => {
  const id = 'circle-id';
  const { getByTestId, container } = render(
    <CircleMetrics
      id={id}
      chartType={MetricEnums.CHART_TYPE.NORMAL}
      metricType={MetricEnums.METRICS_TYPE.REQUESTS_BY_CIRCLE}
    />
  );

  const control = getByTestId('circle-metric-control-30m');
  control.click();

  const controlStyle = window.getComputedStyle(control);

  waitForDomChange({ container });
  expect(controlStyle.border).toBe(`1px solid ${COLOR_WHITE.toLowerCase()}`);
});
