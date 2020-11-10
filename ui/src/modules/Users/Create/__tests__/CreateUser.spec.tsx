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
import { render, wait, fireEvent, act, screen, waitFor } from 'unit-test/testUtils';
import CreateUser from '..';
import userEvent from '@testing-library/user-event';

(global as any).MutationObserver = MutationObserver

const props = {
  onFinish: jest.fn()
};

const mockCreate = jest.fn();

afterEach(() => {
  mockCreate.mockClear()
});

jest.mock('../../hooks', () => {
  return {
    __esModule: true,
    useCreateUser: () => ({
      create: mockCreate,
      newUser: {},
      status: {}
    })
  };
});

test('render CreateUser default component', async () => {
  render(
    <CreateUser {...props} onFinish={props.onFinish}/>
  );

  waitFor(() => expect(screen.getByTestId('create-user')).toBeInTheDocument());
});

test('close CreateUser component', async () => {
  render(
    <CreateUser {...props} onFinish={props.onFinish}/>
  );

  await waitFor(() => expect(screen.getByTestId('create-user')).toBeInTheDocument());

  const tabPanelCloseButton = screen.queryByTestId('icon-cancel');
  expect(tabPanelCloseButton).toBeInTheDocument();

  act(() => (userEvent.click(tabPanelCloseButton)));
  waitFor(() => expect(screen.getByTestId('create-user')).not.toBeInTheDocument());
});

test("render CreateUser Form component with empty fields", async () => {
  render(
    <CreateUser {...props} onFinish={props.onFinish} />
  );

  expect(screen.getByTestId("create-user")).toBeInTheDocument();

  const ContentCreateUser = screen.getByTestId("content-create-user");
  expect(ContentCreateUser).toBeInTheDocument();

  const FormCreateUser = screen.getByTestId("form-create-user");
  expect(FormCreateUser).toBeInTheDocument();

  const ButtonCreateUser = screen.getByTestId("button-create-user");
  expect(ButtonCreateUser).toBeInTheDocument();
  await waitFor (() => expect(ButtonCreateUser).toBeDisabled());

  const InputName = screen.getByTestId("input-text-name");
  const InputEmail = screen.getByTestId("input-text-email");
  const InputPassword = screen.getByTestId("input-password-password");
  
  expect(InputName).toBeEmptyDOMElement();
  expect(InputEmail).toBeEmptyDOMElement();
  expect(InputPassword).toBeEmptyDOMElement();
});

test("render CreateUser Form and submit when required fields filled", async () => {
  render(
    <CreateUser {...props} onFinish={props.onFinish} />
  );

  const ButtonCreateUser = screen.getByTestId("button-create-user");
  const InputName = screen.getByTestId("input-text-name");
  const InputEmail = screen.getByTestId("input-text-email");
  const InputPassword = screen.getByTestId("input-password-password");

  await act(async () => {
    userEvent.type(InputName, 'name');
    userEvent.type(InputEmail, 'charles@zup.com.br');
    userEvent.type(InputPassword, '1!@charles123');

    expect(ButtonCreateUser).not.toBeDisabled();

    userEvent.click(ButtonCreateUser);
  })

  await waitFor(() => {
    expect(props.onFinish).toBeCalled();
    expect(mockCreate).toBeCalledTimes(1);
  });
});