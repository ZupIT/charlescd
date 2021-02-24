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
import { render, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Modal from 'core/components/Modal';

test('render Trigger', () => {
  render(<Modal.Wizard onClose={jest.fn} />);

  const modal = screen.getByTestId('modal-wizard');
  const nextButton = screen.getByTestId('button-iconRounded-next');

  expect(modal).toBeInTheDocument();
  expect(nextButton).toBeInTheDocument();
});

test('Next button click', async () => {
  render(<Modal.Wizard onClose={jest.fn} />);

  const welcome = screen.getByTestId('modal-wizard-info-welcome');
  const button = screen.getByTestId('button-iconRounded-next');

  expect(welcome).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  userEvent.click(button);
  await waitFor(() => expect(screen.getByTestId('modal-wizard-info-user-group')).toBeInTheDocument());
});


