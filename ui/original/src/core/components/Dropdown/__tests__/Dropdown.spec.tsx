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
import { render, screen} from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Dropdown from '../';
import { Props as ActionProps } from '../Item';

const action: ActionProps = {
  icon: 'delete',
  name: 'Delete',
  onClick: () => jest.fn()
};

test('render Dropdown', () => {
  render(
    <Dropdown>
      <Dropdown.Item
        name={action.name}
        icon={action.icon}
        onClick={action.onClick} />
    </Dropdown>
  );

  const element = screen.getByTestId('dropdown');
  expect(element).toBeInTheDocument();
});


test('render Dropdown and toggle actions container', () => {
  render(
    <Dropdown>
      <Dropdown.Item
        name={action.name}
        icon={action.icon}
        onClick={action.onClick} />
    </Dropdown>
  );

  const iconVerticalDots = screen.getByTestId('icon-vertical-dots');
  expect(iconVerticalDots).toBeInTheDocument();
  userEvent.click(iconVerticalDots);

  const element = screen.getByTestId('dropdown');
  expect(element).toBeInTheDocument();

  const actionsContainer = screen.getByTestId('dropdown-actions');
  expect(actionsContainer).toBeInTheDocument();
});