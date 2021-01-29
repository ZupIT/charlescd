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
import { render, screen, act } from 'unit-test/testUtils';
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

  await act(async() => {
    userEvent.click(githubButton);
  
  });

  await act(async() => {
    userEvent.type(screen.getByTestId('input-text-credentials.accessToken'), '123');
    userEvent.type(screen.getByTestId('input-text-name'), 'github');
  })

  const testConnectionButton = screen.getByTestId('button-default-test-connection');
  await act(async() => {
    userEvent.click(testConnectionButton)
  })
  const connectionMessageElement = await screen.findByText('Successful connection with git.');
});
