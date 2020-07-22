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
import { render, screen } from 'unit-test/testUtils';
import ReleaseComponentsTable from '../ReleaseComponentsTable';
import { releaseComponentsMock } from './fixtures';

test('render default ReleaseComponentsTable', () => {
  render(
    <ReleaseComponentsTable components={releaseComponentsMock} />
  );

  expect(screen.getAllByText(/module a/)).toHaveLength(2);
  expect(screen.getAllByText(/component a/)).toHaveLength(2);
  expect(screen.getAllByText('1.0')).toHaveLength(2);
});
