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
import { render, screen, waitFor, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import SectionRegistry from '../';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('should render form', async () => {
  const form = 'registry';
  const setForm = jest.fn();
  const data = {"id": "1234", "name": "charles-cd" };

  render(<SectionRegistry form={form} setForm={setForm} data={data} />);

  const textElement = await screen.findByText('Add Registry');
  expect(textElement).toBeInTheDocument();
}); 

test('should render registry with error', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));

  const form = '';
  const setForm = jest.fn();
  const data = {"id": "1234", "name": "charles-cd" };

  render(<SectionRegistry form={form} setForm={setForm} data={data} />);

  const errorText = await screen.findByText('invalid registry');
  expect(errorText).toBeInTheDocument();
});

test('should render registry successful', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ status: '200' }));

  const form = '';
  const setForm = jest.fn();
  const data = {"id": "1234", "name": "charles-cd" };

  render(<SectionRegistry form={form} setForm={setForm} data={data} />);

  const errorText = screen.queryByTestId('log-error');
  expect(errorText).not.toBeInTheDocument();
});

test('should remove/cancel registry', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ status: '200' }));

  const form = '';
  const setForm = jest.fn();
  const data = {"id": "1234", "name": "charles-cd" };

  render(<SectionRegistry form={form} setForm={setForm} data={data} />);

  let cancelIcon = await screen.findByTestId('icon-cancel');
  expect(cancelIcon).toBeInTheDocument();
  userEvent.click(cancelIcon);

  cancelIcon = await screen.findByTestId('icon-cancel');
  expect(cancelIcon).not.toBeInTheDocument();
});
