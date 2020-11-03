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
import { render, waitFor, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import CardExpand from '../';

test('render CardExpand with children', () => {
  const onclick = jest.fn();
  render(
    <CardExpand onClick={onclick}>
      <span>charles/ui:v1</span>
    </CardExpand>
  );

  expect(screen.getByText('charles/ui:v1')).toBeInTheDocument();
});

test('click outside CardExpand', () => {
  const onclick = jest.fn();

  render(
    <div data-testid="wrapper-card-expand">
      <CardExpand onClick={onclick}>
        <span>item 2</span>
      </CardExpand>
    </div>
  );

  const CardWrapper = screen.getByTestId('wrapper-card-expand');
  userEvent.click(CardWrapper);
  expect(onclick).toHaveBeenCalled();
});