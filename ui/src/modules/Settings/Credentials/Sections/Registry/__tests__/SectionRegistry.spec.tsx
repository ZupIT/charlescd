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

import { FetchMock } from 'jest-fetch-mock/types';
import React from 'react';
import { render, act, screen } from 'unit-test/testUtils';
import SectionRegistry from '../';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

// jest.mock('../Sections/Registry/hooks', () => {
//   return {
//     __esModule: true,
//     useRegistry: () => ({
//       remove: jest.fn(),
//       responseRemove: null
//     })
//   };
// });

test('render registry with error', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));

  const form = '';
  const setForm = jest.fn();
  const data = {"name": "charles-cd", "id": "1234"};

  render(<SectionRegistry form={form} setForm={setForm} data={data} />);

  const errorText = await screen.findByText('invalid registry');
  expect(errorText).toBeInTheDocument();
})

test.only('render registry successful', () => {
  const success = {
    message: 'response'
  };
  (fetch as FetchMock).mockResponse(JSON.stringify(success));

  const form = '';
  const setForm = jest.fn();
  const data = {"name": "charles-cd", "id": "1234"};

  render(<SectionRegistry form={form} setForm={setForm} data={data} />);

  // const errorText = screen.queryByTestId('log-error');
  // expect(errorText).not.toBeInTheDocument();
})