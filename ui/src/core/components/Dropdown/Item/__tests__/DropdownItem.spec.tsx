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
import DropdownItem from '../';
import { Props as ActionProps } from '../';
import {COLOR_COMET} from 'core/assets/colors';

const onClick = jest.fn();

const action: ActionProps = {
  icon: 'delete',
  name: 'Delete',
  tooltip: 'Tooltip here!'
};

test('should render an Inactive Item, on hover show a tooltip and be disabled', async () => {
  render(<DropdownItem {...action} onClick={onClick} isInactive />);

  const deleteButton = screen.getByTestId('dropdown-item-delete-Delete');
  expect(deleteButton).toBeInTheDocument();
  userEvent.hover(deleteButton);
  
  const deleteButtonText = await screen.findByText('Delete');
  expect(deleteButtonText).toHaveStyle(`color: ${COLOR_COMET}`);
  
  const tooltipText = screen.getByText('Tooltip here!');
  expect(tooltipText).toBeInTheDocument();

  userEvent.click(deleteButton);
  expect(onClick).not.toBeCalled();
});

test('should render an Active Item, on hover not show a tooltip and not be disabled', async () => {
  render(<DropdownItem {...action} onClick={onClick} />);

  const deleteButton = screen.getByTestId('dropdown-item-delete-Delete');
  expect(deleteButton).toBeInTheDocument();
  userEvent.hover(deleteButton);

  const deleteButtonText = await screen.findByText('Delete');
  expect(deleteButtonText).not.toHaveStyle(`color: ${COLOR_COMET}`);

  const tooltipText = screen.queryByText('Tooltip here!');
  expect(tooltipText).not.toBeInTheDocument();

  userEvent.click(deleteButton);
  expect(onClick).toBeCalled();
});
