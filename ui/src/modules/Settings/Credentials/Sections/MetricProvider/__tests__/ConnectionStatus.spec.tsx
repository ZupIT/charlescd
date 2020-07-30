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
import { render, screen, wait } from 'unit-test/testUtils';
import ConnectionStatus from '../ConnectionStatus';

test('render Connection status default component', async () => {
  render(
    <ConnectionStatus status={''}/>
  );

  await wait();

  expect(screen.getByTestId('connection-error')).toBeInTheDocument();
  expect(screen.getByText('Failed to reach the metrics provider.')).toBeInTheDocument();
});

test('render Connection fail status component', async () => {
  render(
    <ConnectionStatus status={'FAILED'}/>
  );

  await wait();

  expect(screen.getByTestId('connection-error')).toBeInTheDocument();
  expect(screen.getByText('Connection to metric provider failed.')).toBeInTheDocument();
});

test('render Connection suceful status component', async () => {
  render(
    <ConnectionStatus status={'SUCCESS'}/>
  );

  await wait();

  expect(screen.getByTestId('connection-success')).toBeInTheDocument();
  expect(screen.getByText('Successful connection with the metrics provider.')).toBeInTheDocument();
});
