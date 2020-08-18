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
import { FetchMock } from 'jest-fetch-mock/types';
import { render, wait, fireEvent, act } from 'unit-test/testUtils';
import CreateUser from '..';

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
  const { getByTestId } = render(
    <CreateUser {...props} onFinish={props.onFinish}/>
  );

  await wait(() => expect(getByTestId('create-user')).toBeInTheDocument());
});

test('close CreateUser component', async () => {
  const { queryByTestId, getByTestId } = render(
    <CreateUser {...props} onFinish={props.onFinish}/>
  );

  await wait(() => expect(getByTestId('create-user')).toBeInTheDocument());

  const tabPanelCloseButton = queryByTestId('icon-cancel');
  expect(tabPanelCloseButton).toBeInTheDocument();

  fireEvent.click(tabPanelCloseButton);
  wait(() => expect(getByTestId('create-user')).not.toBeInTheDocument())
});

test("render CreateUser Form component with empty fields", async () => {
  const { getByTestId } = render(
    <CreateUser {...props} onFinish={props.onFinish} />
  );

  expect(getByTestId("create-user")).toBeInTheDocument();

  const ContentCreateUser = getByTestId("content-create-user");
  expect(ContentCreateUser).toBeInTheDocument();

  const FormCreateUser = getByTestId("form-create-user");
  expect(FormCreateUser).toBeInTheDocument();

  const ButtonCreateUser = getByTestId("button-create-user");
  expect(ButtonCreateUser).toBeInTheDocument();
  await wait (() => expect(ButtonCreateUser).toBeDisabled());

  const InputName = getByTestId("input-text-name");
  const InputEmail = getByTestId("input-text-email");
  const InputPhotourl = getByTestId("input-text-photoUrl");
  const InputPassword = getByTestId("password-password-password");
  
  expect(InputName).toBeEmpty();
  expect(InputEmail).toBeEmpty();
  expect(InputPhotourl).toBeEmpty();
  expect(InputPassword).toBeEmpty();
});

test("render CreateUser Form and submit when required fields filled", async () => {
  const { getByTestId } = render(
    <CreateUser {...props} onFinish={props.onFinish} />
  );

  const ButtonCreateUser = getByTestId("button-create-user");
  const InputName = getByTestId("input-text-name");
  const InputEmail = getByTestId("input-text-email");
  const InputPassword = getByTestId("password-password-password");

  await act(async () => {
    fireEvent.change(InputName, { target: { value: 'name' }});
    fireEvent.change(InputEmail, { target: { value: 'charles@zup.com.br' }});
    fireEvent.change(InputPassword, { target: { value: '123457' }});

    expect(ButtonCreateUser).not.toBeDisabled();

    fireEvent.click(ButtonCreateUser);
  })

  await wait(() => {
    expect(props.onFinish).toBeCalled();
    expect(mockCreate).toBeCalledTimes(1);
  });
});