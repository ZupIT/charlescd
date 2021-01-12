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
import { render, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import userEvent from '@testing-library/user-event';
import Menu from '../index';

test('render Menu users groups default', async () => {
  render(
    <Menu 
      onSearch={jest.fn()}
      onCreate={jest.fn()}
      onSelect={jest.fn()}
      isLoading={false}
      selectedItems={null}
      items={[]}
    />
  );

  const menu = screen.getByTestId('users-groups-menu');
  const emptyItems = screen.getByText('No User group was found');

  expect(menu).toBeInTheDocument();
  expect(emptyItems).toBeInTheDocument();
});
