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
 import { FetchMock } from 'jest-fetch-mock';
 import ReleasesHistory from '../index';
 import { render, screen, wait, fireEvent } from 'unit-test/testUtils';
 import { ReleasesMock , filter} from './fixtures';
 import { ReleaseHistoryRequest } from '../../interfaces';


beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render default ReleaseTable', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(ReleasesMock)
  );

  render(
    <ReleasesHistory filter={filter as ReleaseHistoryRequest}/>
  );

  await wait();

  expect(screen.getByTestId('release-history')).toBeInTheDocument();
  expect(screen.getByText('release 1')).toBeInTheDocument();
  expect(screen.getByText('circle 1')).toBeInTheDocument();
  expect(screen.getByText('1:13m')).toBeInTheDocument();
  expect(screen.getByText('Jhon Doe')).toBeInTheDocument();
});

test('render Components Row', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(ReleasesMock)
  );

  render(
    <ReleasesHistory filter={filter as ReleaseHistoryRequest}/>
  );

  await wait();

  const release = screen.getByTestId('release-table-row-1');
  fireEvent.click(release);

  expect(screen.getAllByText(/module a/)).toHaveLength(2);
});

