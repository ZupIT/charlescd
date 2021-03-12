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
import { render, screen, waitFor } from 'unit-test/testUtils';
import * as StateHooks from 'core/state/hooks';
import Footer from '../';

test('render Footer', async () => {
  render(<Footer />);

  const component = await screen.findByTestId('footer');
  const version = await screen.findByText('Version 0.6.1');

  expect(component).toBeInTheDocument();
  expect(version).toBeInTheDocument();
});

test('render Footer with success notification', async () => {
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      notification: {
        isVisible: true,
        text: 'Success',
        status: 'success'
      }
    });

  render(<Footer />);

  const component = await screen.findByTestId('footer');
  await waitFor(() => expect(component).toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('notification')).toBeInTheDocument());
});
