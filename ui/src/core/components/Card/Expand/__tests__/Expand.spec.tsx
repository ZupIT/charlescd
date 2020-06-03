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
import { render, wait, fireEvent } from 'unit-test/testUtils';
import CardExpand from '../';

test('render CardExpand with children', async () => {
  const onclick = jest.fn();
  const { getByText } = render(
    <CardExpand onClick={onclick}>
      <span>charles/ui:v1</span>
    </CardExpand>
  );

  await wait(() => expect(getByText('charles/ui:v1')).toBeInTheDocument());
});

test('click outside CardExpand', async () => {
  const onclick = jest.fn();
  const { getByTestId } = render(
    <div data-testid="wrapper-card-expand">
      <CardExpand onClick={onclick}>
        <span>item 2</span>
      </CardExpand>
    </div>
  );

  const CardWrapper = getByTestId('wrapper-card-expand');
  fireEvent.click(CardWrapper);

  await wait(() => expect(onclick).toHaveBeenCalled());
});