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
import { render, wait, fireEvent, screen, waitFor, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import UsersComparationItem from '../';
import * as PathUtils from 'core/utils/path';
import { FetchMock } from 'jest-fetch-mock/types';

const props = {
  email: 'test@zup.com.br'
};

test('render UsersComparationItem default component', async () => {
  render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  const userComparationElement = await screen.findByTestId(`users-comparation-item-${props.email}`);
  expect(userComparationElement).toBeInTheDocument();
});

test('render Modal.Trigger on UsersComparationItem component', async () => {
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
  await act(async () => userEvent.click(cancelButton));

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
  const delParamSpy = spyOn(PathUtils, 'delParam');
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

  const resetPasswordButton = screen.getByTestId('labeledIcon-shield');
  userEvent.click(resetPasswordButton);

  const modal = screen.queryByTestId('modal-default');
  expect(modal).toBeInTheDocument();
});
