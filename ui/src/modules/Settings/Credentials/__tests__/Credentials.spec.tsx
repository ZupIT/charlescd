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
import MutationObserver from 'mutation-observer'
import { render, fireEvent, wait } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import Credentials from '..';

(global as any).MutationObserver = MutationObserver

test('render Credentials default component', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'workspace' }));
  const { getByTestId } = render(
    <Credentials />
  );

  await wait();

  expect(getByTestId("credentials")).toBeInTheDocument();
});

test('render Credentials with inner form', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'workspace' }));
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  const { getByTestId, getAllByTestId, debug } = render(
    <Credentials />
  );

  const addButtons = getAllByTestId("button-iconRounded-add");
  expect(addButtons.length).toBe(6);

  fireEvent.click(addButtons[0]);

  expect(getByTestId("credentials")).toBeInTheDocument();
  wait(() => expect(getByTestId("icon-arrow-left")).toBeInTheDocument());
});
