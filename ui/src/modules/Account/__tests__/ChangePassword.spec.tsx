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
import { render, wait, fireEvent } from 'unit-test/testUtils';
import MutationObserver from 'mutation-observer';
import ChangePassword from '../ChangePassword';

(global as any).MutationObserver = MutationObserver

test('check if button is disabled', async () => {
  const { queryByTestId } = render(<ChangePassword />);
  const button = queryByTestId('button-default-change-password');

  await wait(() => expect(button).toBeInTheDocument());
  
  expect(button).toBeDisabled();
});

test('render error in invalid field', async () => {
  const { queryByTestId } = render(<ChangePassword />);
  const newPassword = queryByTestId('input-password-newPassword');
  const confirmPassword = queryByTestId('input-password-confirmPassword');

  await wait(() => expect(newPassword).toBeInTheDocument());
  fireEvent.blur(newPassword);
  fireEvent.blur(confirmPassword);
  await wait(() => expect(queryByTestId('error-newPassword')).toBeInTheDocument());
  await wait(() => expect(queryByTestId('error-confirmPassword')).toBeInTheDocument());
});
