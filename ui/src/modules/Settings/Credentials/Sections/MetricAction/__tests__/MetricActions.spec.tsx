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
import { render, screen, fireEvent } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { actionsData } from './fixtures';
import MetricAction from '../index';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render Metric Action Section without data', async () => {
  const handleSetForm = jest.fn();
  const handleGetNewAction = jest.fn();

  render(<MetricAction 
    form={null}
    setForm={handleSetForm}
    actions={[]}
    getNewActions={handleGetNewAction}
  />);

  const sectionTitle = screen.getByText('Metric Action');
  const addActionButton = screen.getByTestId('button-iconRounded-add');

  expect(sectionTitle).toBeInTheDocument();
  expect(addActionButton).toBeInTheDocument();
});

test('render Metric Action Section with data and delete a action', async () => {
  const handleSetForm = jest.fn();
  const handleGetNewAction = jest.fn();

  render(<MetricAction 
    form={null}
    setForm={handleSetForm}
    actions={actionsData}
    getNewActions={handleGetNewAction}
  />);

  const actionCard = screen.getByText('Action 1');
  const actionCardRemove = screen.getAllByTestId('icon-cancel');

  fireEvent.click(actionCardRemove[1]);

  expect(actionCard).toBeInTheDocument();
});

test('render Metric Action Section and open add action form', async () => {
  const handleSetForm = jest.fn();
  const handleGetNewAction = jest.fn();

  render(<MetricAction 
    form={null}
    setForm={handleSetForm}
    actions={[]}
    getNewActions={handleGetNewAction}
  />);

  const addAction = screen.getByTestId('button-iconRounded-add');

  fireEvent.click(addAction);

  expect(handleSetForm).toHaveBeenCalled();
});

test('render Metric Action Form and go back', async () => {
  const handleSetForm = jest.fn();
  const handleGetNewAction = jest.fn();

  render(<MetricAction 
    form={'action'}
    setForm={handleSetForm}
    actions={[]}
    getNewActions={handleGetNewAction}
  />);

  const actionForm = screen.getByTestId('add-action-form');
  
  expect(actionForm).toBeInTheDocument();
  
  const goBack = screen.getByTestId('icon-arrow-left');

  fireEvent.click(goBack);
});
