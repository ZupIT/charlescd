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
import { releaseComponentsMock } from './ReleaseComponentsTable.spec';

const circleReleaseMock = {
  id: '1',
  tag: 'release 1',
  deployedAt: '2020-07-12 19:10:26',
  undeployedAt: '2020-07-11 19:10:26',
  authorName: 'Jhon Doe',
  components: releaseComponentsMock
}

test('render default ReleaseRow', () => {
  render(
    <ReleaseRow release={circleReleaseMock} />
  );

  expect(screen.getByText('release 1')).toBeInTheDocument();
  expect(screen.getByText('12/07/2020 • 16:07')).toBeInTheDocument();
  expect(screen.getByText('11/07/2020 • 16:07')).toBeInTheDocument();
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
