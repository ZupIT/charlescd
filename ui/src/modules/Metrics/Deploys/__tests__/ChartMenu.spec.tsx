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
import { render, wait, fireEvent, screen } from 'unit-test/testUtils';
import ChartMenu from '../ChartMenu';

test('render chart buttons', async () => {
  const onReset = jest.fn();
  const { getByTestId } = render(<ChartMenu onReset={onReset}/>);

  await wait();

  expect(getByTestId('chart-menu')).toBeInTheDocument();
});

test('Chart button on click should be call', async () => {
  const onReset = jest.fn();
  
  render(<ChartMenu onReset={onReset}/>);

  await wait();

  const button = screen.getByTestId('icon-horizontal-dots');
  fireEvent.click(button);
  const reset = screen.getByText('Reset');
  fireEvent.click(reset);

  expect(onReset).toHaveBeenCalled();
});
