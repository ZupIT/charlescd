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
import { FetchMock } from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import FormGit from '../Form';

test('should test a git connection', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({})
  );
  const handleOnFinish = jest.fn();

  render(<FormGit onFinish={handleOnFinish}/>);
  
  const githubButton = screen.getByTestId('radio-group-git-item-GitHub');

  userEvent.click(githubButton);

  const address = await screen.findByTestId('input-text-credentials.address');
  const accessToken = await screen.findByTestId('input-password-credentials.accessToken');

  userEvent.type(address, 'github.com');
  userEvent.type(accessToken, '123');

  const testConnectionButton = await screen.findByTestId('button-default-test-connection');
  userEvent.click(testConnectionButton);

  const connectionMessageElement = await screen.findByText('Successful connection with git.');
  expect(connectionMessageElement).toBeInTheDocument();
});
