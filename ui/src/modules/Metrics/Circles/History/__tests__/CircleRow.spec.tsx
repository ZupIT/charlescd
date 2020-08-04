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
import CircleRow from '../CircleRow';
import { CircleHistory } from '../../interfaces';
import { FetchMock } from 'jest-fetch-mock';
import { circlesReleasesMock } from './fixtures';
import * as DateUtils from 'core/utils/date';

const circleHistoryMock: CircleHistory = {
  id: '1',
  status: 'INACTIVE',
  name: 'circle 1',
  lifeTime: 628438,
  lastUpdatedAt: '2020-07-21 19:10:26',
}

test('render default ReleaseRow', () => {
  jest.spyOn(DateUtils, 'dateTimeFormatter').mockReturnValue('21/07/2020 • 16:07');

  render(
    <CircleRow circle={circleHistoryMock} />
  );

  expect(screen.getByText('circle 1')).toBeInTheDocument();
  expect(screen.getByText('21/07/2020 • 16:07')).toBeInTheDocument();
  expect(screen.getByText('7 days')).toBeInTheDocument();
});

test('render active ReleaseRow and show releases table', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify(circlesReleasesMock)
  );

  render(
    <CircleRow circle={{ ...circleHistoryMock, status: 'ACTIVE' }} />
  );

  const tableRow = screen.getByTestId('circle-row-1');
  fireEvent.click(tableRow);

  await wait();

  expect(screen.getAllByText(/release /)).toHaveLength(2);
});
