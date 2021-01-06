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
import ConnectionStatus from '../';

test('render Connection status default component', async () => {
  render(
    <ConnectionStatus errorMessage="" status='success' successMessage="Successful connection" />
  );

  expect(screen.getByTestId('connection-success')).toBeInTheDocument();
  expect(screen.getByText('Successful connection')).toBeInTheDocument();
});

test('render Connection fail status component with default error message', async () => {
  render(
    <ConnectionStatus errorMessage="Error" status='error' successMessage="" />
  );

  expect(screen.getByTestId('connection-error')).toBeInTheDocument();
  expect(screen.getByText('Error')).toBeInTheDocument();
});

test('render Connection fail status component with dynamic error message', async () => {
  const errorMessage = '401 not authorized';

  render(
    <ConnectionStatus errorMessage={errorMessage} successMessage="" status="error" />
  );

  expect(screen.getByTestId('connection-error')).toBeInTheDocument();
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
});

