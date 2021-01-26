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
import userEvent from '@testing-library/user-event';
import * as PathUtils from 'core/utils/path';
import { FetchMock } from 'jest-fetch-mock/types';
import { saveProfile } from 'core/utils/profile';
import UsersComparationItem from '../';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

beforeAll(() => {
  saveProfile({ id: '123', name: 'User', email: 'user@zup.com.br', root: true });
});

const props = {
  name: 'Charles',
  email: 'test@zup.com.br'
};

test('render UsersComparationItem default component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const userComparationElement = await screen.findByTestId(`users-comparation-item-${props.email}`);
  expect(userComparationElement).toBeInTheDocument();
});

test('should open a user and successfully update the name', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({
    name: 'Charles',
    email: 'charlescd@zup.com.br'
  }))

  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const InputNameWrapper = await screen.findByTestId('input-wrapper-name');
  expect(InputNameWrapper).toBeInTheDocument();
  await act(async () => userEvent.click(InputNameWrapper));

  const InputName = await screen.findByTestId('input-text-name');
  expect(InputName).toBeInTheDocument();
  await act(async () => userEvent.type(InputName, 'Charles'));

  const ButtonSubmit = await screen.findByTestId('button-default-submit');
  expect(ButtonSubmit).toBeInTheDocument();
  await act(async () => userEvent.click(ButtonSubmit));
});

test('render Modal.Trigger on UsersComparationItem component', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}))

  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const email = await screen.findByTestId(`users-comparation-item-${props.email}`);
  expect(email).toBeInTheDocument();

  const dropdownButton = await screen.findByTestId('icon-vertical-dots');
  userEvent.click(dropdownButton);

  const deleteIcon = screen.getByTestId('icon-delete');
  expect(deleteIcon).toBeInTheDocument();
  userEvent.click(deleteIcon);

  const Description = await screen.findByText('By deleting this user, all related information will also be deleted. Do you wish to continue?');
  expect(Description).toBeInTheDocument();

  const modal = screen.getByTestId('modal-trigger');
  expect(modal).toBeInTheDocument();
});

test('click on Cancel button in Modal.Trigger component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const email = await screen.findByTestId(`users-comparation-item-${props.email}`);
  expect(email).toBeInTheDocument();

  const dropdownButton = await screen.findByTestId('icon-vertical-dots');
  userEvent.click(dropdownButton);

  const deleteIconButton = screen.getByTestId('icon-delete');
  expect(deleteIconButton).toBeInTheDocument();
  userEvent.click(deleteIconButton);

  const modal = await screen.findByTestId('modal-trigger');
  expect(modal).toBeInTheDocument();
  
  const cancelButton = screen.getByTestId('button-default-dismiss');
  act(() => userEvent.click(cancelButton));

  const modalElement = screen.queryByTestId('modal-trigger');
  expect(modalElement).not.toBeInTheDocument();
});

test('click on Delete button in Modal.Trigger component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const email = screen.getByTestId(`users-comparation-item-${props.email}`);
  expect(email).toBeInTheDocument();

  const dropdownButton = await screen.findByTestId('icon-vertical-dots');
  userEvent.click(dropdownButton);

  const deleteButton = screen.getByTestId('icon-delete');
  expect(deleteButton).toBeInTheDocument();
  userEvent.click(deleteButton);

  const modal = screen.getByTestId('modal-trigger');
  expect(modal).toBeInTheDocument();
});

test('close UsersComparationItem component', async () => {
  const delParamSpy = jest.spyOn(PathUtils, 'delParam');
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const email = screen.getByTestId(`users-comparation-item-${props.email}`);
  expect(email).toBeInTheDocument();

  const tabPanelCloseButton = await screen.findByTestId('icon-cancel');
  expect(tabPanelCloseButton).toBeInTheDocument();

  userEvent.click(tabPanelCloseButton);
  expect(delParamSpy).toHaveBeenCalledWith('user', '/users/compare', expect.anything(), props.email);
});

test('render UsersComparationItem component and trigger ModalResetPassword', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ id: '123-456', password: '123457' })
  );

  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const email = await screen.findByTestId(`users-comparation-item-${props.email}`);
  expect(email).toBeInTheDocument();

  const resetPasswordButton = await screen.findByTestId('labeledIcon-shield');
  userEvent.click(resetPasswordButton);

  const modal = screen.queryByTestId('modal-default');
  expect(modal).toBeInTheDocument();
});
