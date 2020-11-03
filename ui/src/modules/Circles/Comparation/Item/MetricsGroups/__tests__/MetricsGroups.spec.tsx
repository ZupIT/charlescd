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
import { render, screen, act, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import { MetricsGroupData, MetricsGroupWithoutMetricData } from './fixtures';
import MetricsGroups from '../';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render default Metrics Groups', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupData)
  );

  const handleClick = jest.fn();
  
  render(<MetricsGroups id={'1'} onGoBack={handleClick}/>);

  const goBack = await screen.findByTestId('icon-arrow-left');

  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
  expect(screen.getByTestId('metrics-groups-list')).toBeInTheDocument();
  expect(screen.getByTestId('button-iconRounded-refresh')).toBeInTheDocument();
  expect(screen.getByTestId('button-iconRounded-add')).toBeInTheDocument();

  userEvent.click(goBack);
  expect(handleClick).toHaveBeenCalled();
});

test('render default Metrics Groups and toogle Chart', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  const toogleChart = await screen.findByTestId('labeledIcon-no-view');
  
  await act(async () => userEvent.click(toogleChart));

  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-filter')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-view')).toBeInTheDocument();

});

test('render default Metrics Groups and filter Chart', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  const toogleChart = await screen.findByTestId('labeledIcon-no-view');
  await act(async () => userEvent.click(toogleChart));

  const openFilterSelect = screen.getByTestId('labeledIcon-filter');
  userEvent.click(openFilterSelect);

  expect(screen.getByText('Metrics groups')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-filter')).toBeInTheDocument();
  expect(screen.getByTestId('labeledIcon-view')).toBeInTheDocument();
});

test('render add metrics group modal', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  const addMetricsGroup = screen.getByText('Add metrics group');
  userEvent.click(addMetricsGroup);

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
  
  const closeAddMetricsGroup = screen.getByTestId('icon-cancel');
  userEvent.click(closeAddMetricsGroup);
  
  await waitFor(() => expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument());
});

test('render default Metrics Groups and refresh screen', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  const refresh = screen.getByText('Refresh');
  userEvent.click(refresh);
  
  await waitFor(() => expect(screen.getByText('Metrics groups')).toBeInTheDocument());
});

test('render default Add metric to the group', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);
  
  const metricsGroupMenu = await screen.findByTestId('icon-vertical-dots');
  userEvent.click(metricsGroupMenu);
  userEvent.click(screen.getByText('Add metric'));
  
  await waitFor(() => expect(screen.getByTestId('add-metric')).toBeInTheDocument());
});

// TODO console.error verify
test.skip('render metrics groups and delete a metrics group', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupWithoutMetricData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  const metricsGroupMenu = await screen.findByTestId('icon-vertical-dots');
  await act(async () => userEvent.click(metricsGroupMenu));

  const deleteButton = await screen.findByTestId('dropdown-item-delete-Delete');

  await act(async () => userEvent.click(deleteButton));

  await waitFor(() => expect(screen.queryByText('test 1a')).not.toBeInTheDocument());
});
