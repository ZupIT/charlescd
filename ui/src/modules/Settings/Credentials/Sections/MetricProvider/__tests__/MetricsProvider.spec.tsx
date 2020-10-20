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
import { fireEvent, render, screen, wait } from 'unit-test/testUtils';
import { Datasources } from './fixtures';
import MetricProvider from '../index';
import * as MetricProviderHooks from '../../../Sections/MetricProvider/hooks';
import { FORM_METRIC_PROVIDER } from '../constants';

test('render Metrics Provider default component', async () => {
  const setForm = jest.fn();
  render(
    <MetricProvider form={null} setForm={setForm} data={Datasources} />
  );

  await wait();

  expect(screen.getByTestId('contentIcon-metrics')).toBeInTheDocument();
  expect(screen.getByText('Prometheus')).toBeInTheDocument();
});

test('toggle form have been called', async () => {
  const setForm = jest.fn();
  render(
    <MetricProvider form={null} setForm={setForm} data={Datasources} />
  );

  await wait();

  const addDatasource = screen.getByTestId('section-datasources')
    .querySelector('[data-testid="button-iconRounded-add"]')

  fireEvent.click(addDatasource)

  expect(setForm).toHaveBeenCalled();
});

test('render datasource form', async () => {
  const setForm = jest.fn();
  render(
    <MetricProvider form={FORM_METRIC_PROVIDER} setForm={setForm} data={Datasources} />
  );

  await wait();

  expect(screen.getByTestId('select-url')).toBeInTheDocument();
});

test('should be delete Metric Provider', async () => {
  const setForm = jest.fn();
  const remove = jest.fn();
  jest.spyOn(MetricProviderHooks, 'useDatasource').mockImplementation(() => ({
    remove: remove,
  }));
  render(
    <MetricProvider form={null} setForm={setForm} data={Datasources} />
  );

  await wait();

  const deleteMetricIcon = screen.getByTestId('section-datasources')
    .querySelector('[data-testid="icon-cancel"]')

  fireEvent.click(deleteMetricIcon)

  expect(remove).toHaveBeenCalled();
});

