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
import { render, fireEvent, wait } from 'unit-test/testUtils';
import Metrics from '..';

test('render Metrics default componet', async () => {
  const { getByTestId } = render(<Metrics />);

  await wait();

  expect(getByTestId("page")).toBeInTheDocument();
  expect(getByTestId("page-menu")).toBeInTheDocument();
})

test('render Metrics deploy dashboard componet', async () => {
  const { getByText, getByTestId } = render(<Metrics />);

  await wait();

  const deployDashboard = getByText("Deploys");
  fireEvent.click(deployDashboard);

  wait(() => expect(getByTestId("metrics-deploy")).toBeInTheDocument());
})

