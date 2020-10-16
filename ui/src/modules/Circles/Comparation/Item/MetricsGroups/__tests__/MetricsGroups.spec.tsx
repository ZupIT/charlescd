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
import { render, screen, fireEvent, wait } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { metricsGroupData, metricsGroupWithoutMetricData } from './fixtures';
import MetricsGroups from '../index';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render default Metrics Groups', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  const handleClick = jest.fn();
  render(<MetricsGroups id={'1'} onGoBack={handleClick}/>);

  await wait();

  const goBack = screen.getByTestId('icon-arrow-left');

  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
  expect(screen.getByTestId('metrics-groups-list')).toBeInTheDocument();
  expect(screen.getByTestId('button-iconRounded-refresh')).toBeInTheDocument();
  expect(screen.getByTestId('button-iconRounded-add')).toBeInTheDocument();

  fireEvent.click(goBack);
  expect(handleClick).toHaveBeenCalled();
});

test('render default Metrics Groups and toogle Chart', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const toogleChart = screen.getByTestId('labeledIcon-no-view');
  fireEvent.click(toogleChart);

  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-filter')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-view')).toBeInTheDocument();
});

test('render default Metrics Groups and filter Chart', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const toogleChart = screen.getByTestId('labeledIcon-no-view');
  fireEvent.click(toogleChart);

  const openFilterSelect = screen.getByTestId('labeledIcon-filter');
  fireEvent.click(openFilterSelect);

  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-filter')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-view')).toBeInTheDocument();
});

test('render add metrics group modal', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const addMetricsGroup = screen.getByText('Add metrics group');
  fireEvent.click(addMetricsGroup);
  
  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
  
  const closeAddMetricsGroup = screen.getByTestId('icon-cancel');
  fireEvent.click(closeAddMetricsGroup);

  expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument();
});

test('render default Metrics Groups and refresh screen', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const refresh = screen.getByText('Refresh');
  fireEvent.click(refresh);
  
  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
});

test('render default Add metric to the group', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();
  
  const metricsGroupMenu = screen.getByTestId('icon-vertical-dots');
  fireEvent.click(metricsGroupMenu);
  fireEvent.click(screen.getByText('Add metric'));
  
  expect(screen.getByTestId('add-metric')).toBeInTheDocument();
});

test('render metrics groups and delete a metrics group', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const metricsGroupMenu = screen.getByTestId('icon-vertical-dots');
  fireEvent.click(metricsGroupMenu);
  fireEvent.click(screen.getByText('Delete'));

  expect(screen.queryByText('test 1a')).not.toBeInTheDocument();
});

test('render metrics groups and edit a metrics group', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const metricsGroupMenu = screen.getByTestId('icon-vertical-dots');

  fireEvent.click(metricsGroupMenu);
  fireEvent.click(screen.getByText('Edit'));

  const submit = screen.getByTestId('button-default-save');

  expect(screen.queryByText('Edit metrics group')).toBeInTheDocument();
  
  fireEvent.click(submit);
});

test('render metrics groups and open new metric form', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const addMetric = screen.getByTestId('button-default-add-metric');
  
  fireEvent.click(addMetric);

  const addMetricForm = screen.getByTestId('add-metric');

  expect(addMetricForm).toBeInTheDocument();
});

test('render metrics groups and open new action form', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const actionTab = screen.getByTestId('tab-1');

  fireEvent.click(actionTab);

  const addAction = screen.getByTestId('button-default-add-action');
  
  fireEvent.click(addAction);

  const addActionForm = screen.getByTestId('metric-group-action-form');

  expect(addActionForm).toBeInTheDocument();
});
  
test('render metrics groups and delete metric', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const metricDropdown = screen.getAllByTestId('icon-vertical-dots');

  fireEvent.click(metricDropdown[1]);
  fireEvent.click(screen.getByText('Delete'));
});

test('render metrics groups and edit metric', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const metricDropdown = screen.getAllByTestId('icon-vertical-dots');

  fireEvent.click(metricDropdown[1]);
  fireEvent.click(screen.getByText('Edit metric'));

  const addMetricForm = screen.getByTestId('add-metric');

  expect(addMetricForm).toBeInTheDocument();
});

test('render metrics groups and delete action', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const actionTab = screen.getByTestId('tab-1');

  fireEvent.click(actionTab);

  const metricDropdown = screen.getAllByTestId('icon-vertical-dots');

  fireEvent.click(metricDropdown[1]);
  fireEvent.click(screen.getByText('Delete action'));
});

test('render metrics groups and edit action', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(metricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const actionTab = screen.getByTestId('tab-1');

  fireEvent.click(actionTab);

  const metricDropdown = screen.getAllByTestId('icon-vertical-dots');

  fireEvent.click(metricDropdown[1]);
  fireEvent.click(screen.getByText('Edit action'));

  const addActionForm = screen.getByTestId('metric-group-action-form');
  const goBack = screen.getByTestId('icon-arrow-left');
  
  expect(addActionForm).toBeInTheDocument();

  fireEvent.click(goBack);
});
