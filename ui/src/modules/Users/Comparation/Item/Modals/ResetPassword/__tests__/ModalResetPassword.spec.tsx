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
import { render, fireEvent } from 'unit-test/testUtils';
import ModalResetPassword from '..';

test('render ModalResetPassword component', () => {
  const onClose = jest.fn();

  const props = {
    user: { id: '123', name: 'user', email: 'user@email.com' },
  };

  const { getByTestId } = render(
    <ModalResetPassword user={props.user} onClose={onClose} />
  );

  const element = getByTestId('modal-default');
  expect(element).toBeInTheDocument();
});

test('render ModalResetPassword component and trigger reset', () => {
  const onClose = jest.fn();

  const props = {
    user: { id: '123', name: 'user', email: 'user@email.com' },
  };

  const { getByTestId } = render(
    <ModalResetPassword user={props.user} onClose={onClose} />
  );

  const button = getByTestId('button-default-reset-password');
  expect(button).toBeInTheDocument();

  fireEvent.click(button);

  const inputAction = getByTestId('input-action-new-password')
  expect(inputAction).toBeInTheDocument();
});
