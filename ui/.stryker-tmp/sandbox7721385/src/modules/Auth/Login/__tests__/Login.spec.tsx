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


import React from 'react';
import { render, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Login from '..';
import routes from 'core/constants/routes';
import 'unit-test/setup-msw';
import { server, rest } from 'mocks/server';
import { DEFAULT_TEST_BASE_URL } from 'setupTests';

const originalWindow = window;
beforeEach(() => {
  Object.assign(window, originalWindow);
  const location = window.location
  delete global.window.location
  global.window.location = Object.assign({}, location)
})

test('render Login page', async () => {
  render(<Login />);

  const iconCharles = await screen.findByTestId('icon-charles-logo');
  const inputEmail = await screen.findByTestId('input-email-email');
  const inputPassword = await screen.findByTestId('input-password-password');
  const buttonSubmit = await screen.findByTestId('button-default-submit');

  expect(iconCharles).toBeInTheDocument();
  expect(inputEmail).toBeInTheDocument();
  expect(inputPassword).toBeInTheDocument();
  expect(buttonSubmit).toBeInTheDocument();
  expect(buttonSubmit).toBeDisabled();
});

test('login on charles C.D.', async () => {
  window.location = {
    ...window.location,
    href: '/workspaces',
    pathname: '/workspaces',
  };

  render(<Login />);

  const inputEmail = await screen.findByTestId('input-email-email');
  const inputPassword = await screen.findByTestId('input-password-password');
  const buttonSubmit = await screen.findByTestId('button-default-submit');
  
  userEvent.type(inputEmail, 'charlescd@zup.com.br');
  await act(async () => userEvent.type(inputPassword, '123mudar'));

  expect(buttonSubmit).not.toBeDisabled();

  await act(async () => userEvent.click(buttonSubmit));

  expect(window.location.href).toEqual(routes.workspaces);
});

test('should show error message when email or password is incorrect', async () => {
  server.use(
    rest.post(`${DEFAULT_TEST_BASE_URL}/keycloak/auth/realms/:realm/protocol/openid-connect/token`, (req, res, ctx) => {
      return res(
        ctx.status(401, 'Unauthorized'),
      )
    })
  );

  render(<Login />);

  const emailInput = screen.getByTestId('input-email-email');
  const passwordInput = screen.getByTestId('input-password-password');
  const continueButton = screen.getByText('Continue');

  await act(async () => userEvent.type(emailInput, 'charlesadmin@admin'));
  await act(async () => userEvent.type(passwordInput, '123mudar'));
  await act(async () => userEvent.click(continueButton));

  expect(await screen.findByText('The email address or password is incorrect.')).toBeInTheDocument();
});
