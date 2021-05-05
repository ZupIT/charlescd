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
import { render, fireEvent, act, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { FetchMock } from 'jest-fetch-mock';
import CreateRelease from '../index';
import { dark as inputTheme } from 'core/assets/themes/input';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const mockGetModules = JSON.stringify({
  content: [
    {
      id: 'module-1',
      name: 'module-1',
      components: [
        {
          id: 'component-1',
          name: 'component-1'
        },
        {
          id: 'component-1component-1component-1component-1component-1',
          name: 'component-1component-1component-1component-1component-1'
        }
      ]
    }
  ]
});

const mockGetTags1 = JSON.stringify(
  [
    {
      name: 'image-1.0.0',
      artifact: 'module-1/component-1:image-1.0.0'
    }
  ]
);

const mockGetTags2 = JSON.stringify(
  [
    {
      name: 'image-1.0.0',
      artifact: 'module-1/component-1component-1component-1component-1component-1:image-1.0.0'
    }
  ]
);

test('form should be valid', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(mockGetModules)
    .mockResponseOnce(mockGetTags1)
    .mockResponse(JSON.stringify([]));

  render(
    <CreateRelease circleId="123" onDeployed={() => { }} />
  );

  const nameInput = screen.getByTestId('input-text-releaseName');
  await act(async () => userEvent.type(nameInput, 'release-name'));

  const moduleLabel = screen.getByText('Select a module');
  await act(async () => selectEvent.select(moduleLabel, 'module-1'));

  const componentLabel = screen.getByText('Select a component');
  await act(async () => selectEvent.select(componentLabel, 'component-1'));

  const versionInput = screen.getByTestId('input-text-modules[0].version');
  await act(async () => userEvent.type(versionInput, 'image-1.0.0'));

  await waitFor(() =>
    expect(screen.getByTestId('button-default-submit')).not.toBeDisabled(),
    { timeout: 700 }
  );
});

test('should validate form when max lenght is greater than the limit', async () => {
  const errorMessage = 'Sum of component name and version name cannot be greater than 63 characters.';
  (fetch as FetchMock)
    .mockResponseOnce(mockGetModules)
    .mockResponseOnce(mockGetTags2)
    .mockResponse(JSON.stringify([]));

  render(
    <CreateRelease circleId="123" onDeployed={() => { }} />
  );

  const nameInput = screen.getByTestId('input-text-releaseName');
  await act(async () => userEvent.type(nameInput, 'release-name'));

  const moduleLabel = screen.getByText('Select a module');
  await act(async () => selectEvent.select(moduleLabel, 'module-1'));

  const componentLabel = screen.getByText('Select a component');
  await act(async () => selectEvent.select(componentLabel, 'component-1component-1component-1component-1component-1'));

  const versionInput = screen.getByTestId('input-text-modules[0].version');
  await act(async () => userEvent.type(versionInput, 'image-1.0.0'));

  expect(await screen.findByText(errorMessage)).toBeInTheDocument();

  const versionNameLabel = screen.getByTestId('label-text-modules[0].version');
  expect(versionNameLabel).toHaveStyle(`color: ${inputTheme.error.color};`);

  await waitFor(() =>
    expect(screen.getByTestId('button-default-submit')).toBeDisabled(),
    { timeout: 700 }
  );
});

test('form should be invalid when version name not found', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(mockGetModules)
    .mockResponseOnce(JSON.stringify([]));

  render(
    <CreateRelease circleId="123" onDeployed={() => { }} />
  );

  const nameInput = screen.getByTestId('input-text-releaseName');
  fireEvent.change(nameInput, { target: { value: 'release-name' } });

  const moduleLabel = screen.getByText('Select a module');
  await act(async () => selectEvent.select(moduleLabel, 'module-1'));

  const componentLabel = screen.getByText('Select a component');
  await act(async () => selectEvent.select(componentLabel, 'component-1'));

  const versionInput = screen.getByTestId('input-text-modules[0].version');
  fireEvent.change(versionInput, { target: { value: 'version-1' } });

  const submit = await screen.findByTestId('button-default-submit');

  expect(submit).toBeDisabled();
});