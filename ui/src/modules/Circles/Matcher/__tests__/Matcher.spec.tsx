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

import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, screen, waitFor } from 'unit-test/testUtils';
import CircleMatcher from '..';

test('render Circle Matcher form', async () => {
  render(<CircleMatcher />);


  const firstParamKey = screen.getByTestId('input-text-parameters[0].key');
  const firstParamValue = screen.getByTestId('input-text-parameters[0].value');

  userEvent.type(firstParamKey, 'param 1');
  userEvent.type(firstParamValue, 'param 1');
  const addParamButton = screen.getByText('Add parameter');
  await waitFor(() => expect(addParamButton).not.toBeDisabled());
  userEvent.click(addParamButton);

  await waitFor(() => expect(screen.getAllByText('Type a key')).toHaveLength(2));
  const trashIcons = screen.getAllByTestId('icon-trash');
  userEvent.click(trashIcons[0]);
  await waitFor(() => expect(screen.getAllByText('Type a key')).toHaveLength(1));
});
