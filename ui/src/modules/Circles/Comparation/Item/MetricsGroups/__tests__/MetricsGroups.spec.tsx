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
import { MetricsGroupData } from './fixtures';
import MetricsGroups from '../index';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render default Metrics Groups', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(MetricsGroupData)
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
    JSON.stringify(MetricsGroupData)
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
    JSON.stringify(MetricsGroupData)
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
    JSON.stringify(MetricsGroupData)
  );

  render(<MetricsGroups id={'1'} onGoBack={() => { }}/>);

  await wait();

  const addMetricsGroup = screen.getByText('Add metrics group');
  fireEvent.click(addMetricsGroup);

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
});
