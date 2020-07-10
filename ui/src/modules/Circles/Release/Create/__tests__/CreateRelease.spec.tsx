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
import { render, fireEvent, act, waitForElement } from 'unit-test/testUtils';
import MutationObserver from 'mutation-observer';
import selectEvent from 'react-select-event';
import { FetchMock } from 'jest-fetch-mock';
import CreateRelease from '../index';

(global as any).MutationObserver = MutationObserver

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

const mockGetModules = JSON.stringify({
  content: [
    {
      id: 'module-1',
      name: 'module-1',
      components: [
        {
          id: 'component-1',
          name: 'component-1'
        }
      ]
    }
  ]
});

const mockGetTags = JSON.stringify(
  [
    {
      name: 'image-1.0.0',
      artifact: 'domain.com:image-1.0.0'
    }
  ]
);

test('form should be valid', async () => {
  (fetch as FetchMock).mockResponseOnce(mockGetModules);
  (fetch as FetchMock).mockResponseOnce(mockGetTags);

  const { getByTestId, getByText } = render(
    <CreateRelease circleId="123" onDeployed={() => { }} />
  );
  
  const nameInput = getByTestId('input-text-releaseName');
  fireEvent.change(nameInput, { target: { value: 'release-name' }});
  
  const moduleLabel = getByText('Select a module');
  await act(async() => selectEvent.select(moduleLabel, 'module-1'));

  const componentLabel = getByText('Select a component');
  await act(async() => selectEvent.select(componentLabel, 'component-1'));

  const versionInput = getByTestId('input-text-modules[0].version');
  fireEvent.change(versionInput, { target: { value: 'version-1' }});

  const submit = await waitForElement(() => getByTestId('button-default-submit'));

  expect(submit).not.toBeDisabled();
});

test('form should be invalid when version name not found', async () => {
  (fetch as FetchMock).mockResponseOnce(mockGetModules);
  (fetch as FetchMock).mockResponseOnce(JSON.stringify([]));

  const { getByTestId, getByText } = render(
    <CreateRelease circleId="123" onDeployed={() => { }} />
  );
  
  const nameInput = getByTestId('input-text-releaseName');
  fireEvent.change(nameInput, { target: { value: 'release-name' }});
  
  const moduleLabel = getByText('Select a module');
  await act(async() => selectEvent.select(moduleLabel, 'module-1'));

  const componentLabel = getByText('Select a component');
  await act(async() => selectEvent.select(componentLabel, 'component-1'));

  const versionInput = getByTestId('input-text-modules[0].version');
  fireEvent.change(versionInput, { target: { value: 'version-1' }});

  const submit = await waitForElement(() => getByTestId('button-default-submit'));

  expect(submit).toBeDisabled();
});