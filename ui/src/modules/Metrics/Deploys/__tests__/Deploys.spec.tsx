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
import { render, wait, screen, fireEvent } from 'unit-test/testUtils';
import Deploy from '..';

test('render Deploy default screen', async () => {
  render(<Deploy />);

  await wait();

  expect(screen.getByTestId('metrics-deploy')).toBeInTheDocument();
  expect(screen.getByTestId('metrics-filter')).toBeInTheDocument();
  expect(screen.getByTestId('apexchart-deploy')).toBeInTheDocument();
  expect(screen.getByTestId('release-history')).toBeInTheDocument();
  expect(screen.getByTestId('metrics-deploy-apply')).toBeInTheDocument();
})

test('reset chart button', async () => {
  render(<Deploy />);

  const onReset = jest.fn();
  delete window.ApexCharts;

  window.ApexCharts = {
    exec: onReset
  };

  await wait();

  const chartMenu = screen.getByTestId('icon-horizontal-dots');
  fireEvent.click(chartMenu);
  fireEvent.click(screen.getByText('Reset'));

  expect(onReset).toHaveBeenCalled();
})
