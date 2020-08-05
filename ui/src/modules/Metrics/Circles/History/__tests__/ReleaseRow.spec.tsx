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
import ReleaseRow from '../ReleaseRow';
import { circleReleaseMock } from './fixtures';
import * as DateUtils from 'core/utils/date';

test('render default ReleaseRow', () => {
  jest.spyOn(DateUtils, 'dateTimeFormatter').mockReturnValue('12/07/2020 • 16:07')

  render(
    <ReleaseRow release={circleReleaseMock} />
  );

  expect(screen.getByText('release 1')).toBeInTheDocument();
  expect(screen.getAllByText('12/07/2020 • 16:07')).toHaveLength(2);
  expect(screen.getByText('Jhon Doe')).toBeInTheDocument();
  expect(screen.queryAllByText(/module a/)).toHaveLength(0);
});

test('render ReleaseRow without dates', () => {
  render(
    <ReleaseRow release={{ ...circleReleaseMock, deployedAt: null, undeployedAt: null }} />
  );

  expect(screen.getAllByText('-')).toHaveLength(2);
});

test('render ReleaseRow and show components table', () => {
  render(
    <ReleaseRow release={circleReleaseMock} />
  );

  const tableRow = screen.getByTestId('release-table-row-1');
  fireEvent.click(tableRow);

  expect(screen.getAllByText(/module a/)).toHaveLength(2);
});
