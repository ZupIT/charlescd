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
import CircleReleasesTable from '../CircleReleasesTable';
import { render, screen, wait } from 'unit-test/testUtils';
import { circlesReleasesMock } from './fixtures';
import * as DateUtils from 'core/utils/date';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render default CircleReleasesTable', async () => {
  jest.spyOn(DateUtils, 'dateTimeFormatter').mockReturnValue('12/07/2020 • 16:07');

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(circlesReleasesMock)
  );

  render(
    <CircleReleasesTable circleId="1" />
  );

  await wait();

  expect(screen.getAllByText(/release/)).toHaveLength(2);
  expect(screen.getAllByText('12/07/2020 • 16:07')).toHaveLength(4);
  expect(screen.getAllByText('Jhon Doe')).toHaveLength(2);
});
