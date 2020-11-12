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
import Can from '../';
import Dropdown from 'core/components/Dropdown';

test('renders Can component', () => {
  const props = {
    children: (
      <Dropdown.Item
        icon="edit"
        name="Edit segments"
        onClick={() => jest.fn()}
      />
    ),
  };

  render(
    <Can I="write" a="circles" passThrough allowedRoutes>
      {props.children}
    </Can>
  );
  const buttonDropdown = screen.getByTestId('icon-edit');
  expect(buttonDropdown).toBeInTheDocument();
});

test('renders Can component disabled', () => {
  const props = {
    children: (
      <Dropdown.Item
        icon="edit"
        name="Edit segments"
        onClick={() => jest.fn()}
      />
    )
  };

  render(
    <Can I="write" a="circles" passThrough isDisabled>
      {props.children}
    </Can>
  );
  const buttonDropdown = screen.getByTestId('icon-edit');
  expect(buttonDropdown).toBeInTheDocument();
});

test('renders Can component with default properties', () => {
  const props = {
    children: <p>test</p>
  };

  render(
    <Can I="read" a="maintenance">
      {props.children}
    </Can>
  );

  expect(document.body.innerHTML).toBe('<div></div>');
});
