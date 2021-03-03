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
import { FetchMock } from 'jest-fetch-mock/types';
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import SectionWebhook from '../';
import { Webhook } from '../interfaces';

const data: Webhook[] = [{
  id: "123",
  url: 'https://charlescd.io/webhook',
  apiKey: '456',
  description: 'Deploy',
  events: ['DEPLOY'],
  lastDelivery: {
    status: 200,
    details: 'Service available'
  }
}];

test('should render default section', async () => {
  const form = 'webhook';
  const setForm = jest.fn();

  render(<SectionWebhook form={form} setForm={setForm} data={data} />);

  const textElement = await screen.findByText('Add Webhook');
  expect(textElement).toBeInTheDocument();
});

test('should render section with successful webhook card', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ status: '200' }));

  const form = '';
  const setForm = jest.fn();

  render(<SectionWebhook form={form} setForm={setForm} data={data} />);

  const errorText = screen.queryByTestId('log-error');
  expect(errorText).not.toBeInTheDocument();
});

test('should render section and trigger remove webhook action', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ status: '200' }));

  const form = '';
  const setForm = jest.fn();

  render(<SectionWebhook form={form} setForm={setForm} data={data} />);
  
  let iconVerticalDots = await screen.findByTestId('icon-vertical-dots');
  expect(iconVerticalDots).toBeInTheDocument();
  userEvent.click(iconVerticalDots);

  let iconDelete = screen.queryByTestId('dropdown-item-delete-Delete');
  expect(iconDelete).toBeInTheDocument();
});

test('should render section and trigger edit webhook action', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ status: '200' }));

  const form = '';
  const setForm = jest.fn();

  render(<SectionWebhook form={form} setForm={setForm} data={data} />);
  
  let iconVerticalDots = await screen.findByTestId('icon-vertical-dots');
  expect(iconVerticalDots).toBeInTheDocument();
  userEvent.click(iconVerticalDots);

  let iconEdit = screen.queryByTestId('dropdown-item-edit-Edit');
  expect(iconEdit).toBeInTheDocument();
  userEvent.click(iconEdit);
});