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
import { render, screen, act, wait, fireEvent } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Login from '..';

test('render Login page', () => {
  render(<Login />);

  const iconCharles = screen.queryByTestId('icon-charles-logo');
  const inputEmail = screen.queryByTestId('input-email-email');
  const inputPassword = screen.queryByTestId('input-password-password');
  const buttonSubmit = screen.queryByTestId('button-default-submit');
  expect(iconCharles).toBeInTheDocument();
  expect(inputEmail).toBeInTheDocument();
  expect(inputPassword).toBeInTheDocument();
  expect(buttonSubmit).toBeInTheDocument();
  expect(buttonSubmit).toBeDisabled();
});

test('render Login page', async () => {
  render(<Login />);

  const inputEmail = screen.queryByTestId('input-email-email');
  const inputPassword = screen.queryByTestId('input-password-password');
  const buttonSubmit = screen.queryByTestId('button-default-submit');
  
  await act(async () => userEvent.type(inputEmail, 'charlescd@zup.com.br'));
  await act(async () => userEvent.type(inputPassword, '123mudar'));

  expect(buttonSubmit).not.toBeDisabled();
});
