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
import { render, waitFor, fireEvent, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import ChangePassword from '../ChangePassword';

test('check if button is disabled', async () => {
  render(<ChangePassword />);

  const button = await screen.findByTestId('button-default-change-password');

  expect(button).toBeInTheDocument();
  expect(button).toBeDisabled();
});

test('submit password change form', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  const onSubmit = jest.fn();

  render(<ChangePassword onSubmit={onSubmit} />);

  const oldPassword = screen.getByTestId('input-password-oldPassword');
  const newPassword = screen.getByTestId('input-password-newPassword');
  const confirmPassword = screen.getByTestId('input-password-confirmPassword');
  const value = '@Asdfg1234';

  expect(newPassword).toBeInTheDocument();

  userEvent.type(oldPassword, value);
  await act(() => userEvent.type(newPassword, value));
  await act(() => userEvent.type(confirmPassword, value));

  userEvent.tab();

  const button = await screen.findByTestId('button-default-change-password');
  expect(button).not.toBeDisabled();
  userEvent.click(button);
  
  await waitFor(() => expect(onSubmit).toBeCalled());
});