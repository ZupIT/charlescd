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
import { render, fireEvent, screen } from 'unit-test/testUtils';
import { users, emptyUsers } from './fixtures';
import Modal from '..';

test('render users Modal', async () => {
  render(
    <Modal users={users} isOpen onSearch={jest.fn()} onSelected={jest.fn()} />
  );

  const element = screen.getByTestId('modal-user');
  const button = screen.getByTestId('button-default-undefined');

  expect(element).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});

test('testing on selected style', async () => {
  render(
    <Modal users={users} isOpen onSearch={jest.fn()} onSelected={jest.fn()} />
  );

  const user = screen.getByText('User 2');
  const button = screen.getByTestId('button-default-undefined');

  expect(user).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  fireEvent.click(user);

  expect(screen.getByTestId('icon-plus-circle')).toBeInTheDocument();
});

test('testing on click update button', async () => {
  const onSelected = jest.fn();
  render(
    <Modal users={users} isOpen onSearch={jest.fn()} onSelected={onSelected} />
  );

  const user = screen.getByText('User 2');
  const button = screen.getByTestId('button-default-undefined');

  expect(user).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  fireEvent.click(user);
  fireEvent.click(button);

  expect(onSelected).toHaveBeenCalled();
});

test('testing deleting an user', async () => {
  const onSelected = jest.fn();
  render(
    <Modal users={users} isOpen onSearch={jest.fn()} onSelected={onSelected} />
  );

  const user = screen.getByText('User 2');
  const button = screen.getByTestId('button-default-undefined');

  expect(user).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  fireEvent.click(user);
  fireEvent.click(button);
  
  expect(onSelected).toHaveBeenCalled();
  expect(screen.getByTestId('icon-plus-circle')).toBeInTheDocument();
});

test('testing on outside click with isOutsideClick property passed on', async () => {
  const onClose = jest.fn();
  render(
    <div data-testid="external-div">
      <Modal
        users={users}
        isOpen
        onSearch={jest.fn()}
        onSelected={jest.fn()}
        onClose={onClose}
        isOutsideClick
      />
    </div>
  );

  const element = screen.getByTestId('modal-user');
  const externalDiv = screen.getByTestId('external-div');

  expect(element).toBeInTheDocument();
  expect(externalDiv).toBeInTheDocument();

  fireEvent.click(externalDiv);

  expect(onClose).toHaveBeenCalled();
});

test('testing on outside click without isOutsideClick property passed on', async () => {
  render(
    <div data-testid="external-div">
      <Modal
        users={users}
        isOpen
        onSearch={jest.fn()}
        onSelected={jest.fn()}
        onClose={jest.fn()}
      />
    </div>
  );

  const element = screen.getByTestId('modal-user');
  const externalDiv = screen.getByTestId('external-div');
  const button = screen.getByTestId('button-default-undefined');

  expect(element).toBeInTheDocument();
  expect(externalDiv).toBeInTheDocument();

  fireEvent.click(externalDiv);

  expect(button).toHaveAttribute('disabled');
});

test('render Modal placeholder', async () => {
  render(
    <Modal
      users={emptyUsers}
      isOpen
      onSearch={jest.fn()}
      onSelected={jest.fn()}
    />
  );

  const element = screen.getByTestId('modal-user');
  const button = screen.getByTestId('button-default-undefined');
  const placeholder = screen.getByTestId('icon-user-not-found');

  expect(element).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(placeholder).toBeInTheDocument();
});
