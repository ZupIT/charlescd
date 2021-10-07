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
// @ts-nocheck


import { render, screen, fireEvent } from 'unit-test/testUtils';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import fetch, { FetchMock } from 'jest-fetch-mock';
import Settings from '..';

test('render settings wizard', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      id: '1',
      name: 'ws1',
      status: WORKSPACE_STATUS.INCOMPLETE,
      createdAt: ''
    }));
  render(<Settings />);

  await screen.findByTestId('modal-wizard');

  const nextButton = await screen.findByTestId('button-iconRounded-next');

  expect(screen.getByTestId('modal-wizard')).toBeInTheDocument();
  expect(screen.getByTestId('modal-wizard-menu-item-welcome')).toBeInTheDocument();
  fireEvent.click(nextButton);
  expect(screen.getByTestId('modal-wizard-info-user-group')).toBeInTheDocument();
  fireEvent.click(nextButton);
  expect(screen.getByTestId('modal-wizard-info-registry')).toBeInTheDocument();
  fireEvent.click(nextButton);
  expect(screen.getByTestId('modal-wizard-info-cdConfig')).toBeInTheDocument();
  fireEvent.click(nextButton);
  expect(screen.getByTestId('modal-wizard-info-circle-matcher')).toBeInTheDocument();
  fireEvent.click(nextButton);
  expect(screen.getByTestId('modal-wizard-info-metrics-provider')).toBeInTheDocument();
});