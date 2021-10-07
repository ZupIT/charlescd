// @ts-nocheck
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
import Text from 'core/components/Text';
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import ModalTrigger from 'core/components/Modal/Trigger';

test('render Trigger', () => {
  render(
    <ModalTrigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={jest.fn()}
    >
      <Text tag="H4" color="light">
        Test
      </Text>
    </ModalTrigger>
  );

  const modalElement = screen.getByTestId('modal-trigger');
  const continueButton = screen.getByTestId('button-default-continue');

  expect(modalElement).toBeInTheDocument();
  expect(continueButton).toBeInTheDocument();
});

test('onDismiss button click', () => {
  const onDismiss = jest.fn();
  render(
    <ModalTrigger title="Test" dismissLabel="dismiss" onDismiss={onDismiss}>
      <Text tag="H4" color="light">
        Test
      </Text>
    </ModalTrigger>
  );
  const button = screen.getByTestId('button-default-dismiss');
  userEvent.click(button);
  expect(onDismiss).toHaveBeenCalled();
});

test('onContinue button click', () => {
  const onContinue = jest.fn();
  render(
    <ModalTrigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={onContinue}
    >
      <Text tag="H4" color="light">
        Test
      </Text>
    </ModalTrigger>
  );
  const button = screen.getByTestId('button-default-continue');
  userEvent.click(button);
  expect(onContinue).toHaveBeenCalled();
});

test('onClose button click', async () => {
  render(
    <ModalTrigger
      title="Test"
      dismissLabel="dismiss"
      onDismiss={jest.fn()}
      onContinue={jest.fn()}
    >
      Test
    </ModalTrigger>
  );

  const modalElement = screen.getByTestId('modal-trigger');
  const cancelButton = await screen.findByTestId('icon-cancel-modal');
  expect(modalElement).toBeInTheDocument();

  userEvent.click(cancelButton);
  expect(modalElement).not.toBeInTheDocument();
});
