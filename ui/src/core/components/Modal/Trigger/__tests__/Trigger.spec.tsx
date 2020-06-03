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
import Modal from 'core/components/Modal';

test('render Trigger', async () => {
  const { getByTestId } = render(
    <Modal.Trigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={jest.fn()}
    >
        Test
    </Modal.Trigger>
  );

  const element = getByTestId('modal-trigger');
  const button = getByTestId('button-default-continue');
  await wait(() =>   expect(element && button).toBeInTheDocument());
});

test('onDismiss button click', async () => {
  const onDismiss = jest.fn();
  const { getByTestId } = render(
    <Modal.Trigger title="Test" dismissLabel="dismiss" onDismiss={onDismiss}>
        Test
    </Modal.Trigger>
  );
  const button = getByTestId('button-default-dismiss');
  fireEvent.click(button);
  expect(onDismiss).toHaveBeenCalled();
});

test('onContinue button click', async () => {
  const onContinue = jest.fn();
  const { getByTestId } = render(
    <Modal.Trigger title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={onContinue}
    >
        Test
    </Modal.Trigger>
  );
  const button = getByTestId('button-default-continue');
  fireEvent.click(button);
  expect(onContinue).toHaveBeenCalled();
});

test('onClose button click', async () => {
  const { getByTestId } = render(
    <Modal.Trigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={jest.fn()}
    >
        Test
    </Modal.Trigger>
  );

  const element = getByTestId('modal-trigger');
  const button = getByTestId('icon-cancel');
  await wait(() =>   expect(element).toBeInTheDocument());
  fireEvent.click(button);
  await wait(() =>   expect(element).not.toBeInTheDocument());
});