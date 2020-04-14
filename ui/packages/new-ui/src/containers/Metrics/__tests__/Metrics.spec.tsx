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
