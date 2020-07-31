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
import { ModalWizard } from '../interfaces/ModalWizard';
import Modal from 'core/components/Modal';

const wizard: ModalWizard = { isOpen: true, newUser: true };

test('render Trigger', async () => {
  const { getByTestId } = render(<Modal.Wizard wizard={wizard} />);

  const element = getByTestId('modal-wizard');
  const button = getByTestId('button-iconRounded-next');
  await wait(() => expect(element));
  await wait(() => expect(button).toBeInTheDocument());
});

test('Next button click', async () => {
  const { getByTestId } = render(<Modal.Wizard wizard={wizard} />);

  const welcome = getByTestId('modal-wizard-info-welcome');
  const button = getByTestId('button-iconRounded-next');

  await wait(() => expect(welcome).toBeInTheDocument());
  await wait(() => expect(button).toBeInTheDocument());

  fireEvent.click(button);

  await wait(() =>
    expect(getByTestId('modal-wizard-info-user-group')).toBeInTheDocument()
  );
});

test("Let's Start button click", async () => {
  const onClose = jest.fn();
  const { getByTestId } = render(
    <Modal.Wizard wizard={wizard} onClose={onClose} />
  );

  const welcome = getByTestId('modal-wizard-info-welcome');
  const metricsItem = getByTestId('modal-wizard-menu-item-metrics-provider');
  const button = getByTestId('button-iconRounded-next');

  await wait(() => expect(welcome).toBeInTheDocument());
  await wait(() => expect(metricsItem).toBeInTheDocument());
  await wait(() => expect(button).toBeInTheDocument());

  fireEvent.click(metricsItem);

  await wait(() =>
    expect(
      getByTestId('modal-wizard-info-metrics-provider')
    ).toBeInTheDocument()
  );

  fireEvent.click(button);

  expect(onClose).toHaveBeenCalled();
});

test('Menu item click', async () => {
  const { getByTestId } = render(<Modal.Wizard wizard={wizard} />);

  const welcome = getByTestId('modal-wizard-info-welcome');
  const cdConfigItem = getByTestId('modal-wizard-menu-item-cdConfig');

  await wait(() => expect(welcome).toBeInTheDocument());
  await wait(() => expect(cdConfigItem).toBeInTheDocument());

  fireEvent.click(cdConfigItem);

  await wait(() =>
    expect(getByTestId('modal-wizard-info-cdConfig')).toBeInTheDocument()
  );
});
