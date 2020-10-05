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
  const { getByTestId } = render(<Modal.Wizard onClose={jest.fn} />);

  const element = getByTestId('modal-wizard');
  const button = getByTestId('button-iconRounded-next');
  await wait(() => expect(element));
  await wait(() => expect(button).toBeInTheDocument());
});

test('Next button click', async () => {
  const { getByTestId } = render(<Modal.Wizard onClose={jest.fn} />);

  const welcome = getByTestId('modal-wizard-info-welcome');
  const button = getByTestId('button-iconRounded-next');

  await wait(() => expect(welcome).toBeInTheDocument());
  await wait(() => expect(button).toBeInTheDocument());

  fireEvent.click(button);

  await wait(() =>
    expect(getByTestId('modal-wizard-info-user-group')).toBeInTheDocument()
  );
});


