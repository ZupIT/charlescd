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
import { fireEvent, render, screen, wait, act } from 'unit-test/testUtils';
import Form from '../Form';
import * as MetricProviderHooks from '../../../Sections/MetricProvider/hooks';
import { Plugins } from './fixtures';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';

test('render Metrics Provider default component', async () => {
  const finish = jest.fn();
  render(
    <Form onFinish={finish} />
  );

  await wait();

  expect(screen.getByTestId('react-select')).toBeInTheDocument();
});

test('render datasource input by datasource change', async () => {
  jest.spyOn(MetricProviderHooks, 'usePlugins').mockImplementation(() => ({
    getAll: jest.fn,
    response: Plugins
  }));
  const finish = jest.fn();
  render(
    <Form onFinish={finish} />
  );

  await wait();

  const datasourcePlugin1 = screen.getByText('Select a datasource plugin');
  await act(async () => selectEvent.select(datasourcePlugin1, 'Prometheus'));

  expect(screen.getByText('Datasource health')).toBeInTheDocument();
  expect(screen.getByText('Datasource name')).toBeInTheDocument();
  expect(screen.getByText('Url')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('icon-cancel'))

  const datasourcePlugin2 = screen.getByText('Select a datasource plugin');
  await act(async () => selectEvent.select(datasourcePlugin2, 'Google Analytics'));

  expect(screen.getByText('Datasource name')).toBeInTheDocument();
  expect(screen.getByText('View ID')).toBeInTheDocument();
  expect(screen.getByText('Service Account')).toBeInTheDocument();
})

test('render button test connection', async () => {
  const testConnection = jest.fn()
  const finish = jest.fn();

  jest.spyOn(MetricProviderHooks, 'usePlugins').mockImplementation(() => ({
    getAll: jest.fn,
    response: Plugins
  }));

  jest.spyOn(MetricProviderHooks, 'useTestConnection').mockImplementation(() => ({
    save: testConnection,
    response: {}
  }));

  render(
    <Form onFinish={finish} />
  );

  const datasourcePlugin1 = screen.getByText('Select a datasource plugin');
  selectEvent.select(datasourcePlugin1, 'Prometheus');
  const dataSourceHealth = await screen.findByText('Datasource health');
  const dataSourceName = await screen.findByText('Datasource name');
  const dataSourceUrl = await screen.findByText('Url');

  expect(dataSourceHealth).toBeInTheDocument();
  expect(dataSourceName).toBeInTheDocument();
  expect(dataSourceUrl).toBeInTheDocument();

  await act(() => userEvent.type(screen.getByTestId('input-text-name'), 'name'));
  await act(() => userEvent.type(screen.getByTestId('input-text-data.url'), 'name'));

  const btn = await screen.findByTestId('button-default-test-connection');

  expect(btn).not.toBeDisabled();

  fireEvent.click(screen.getByTestId('button-default-test-connection'));
  expect(testConnection).toHaveBeenCalled();
  expect(screen.getByTestId('connection-error')).toBeInTheDocument();
})
