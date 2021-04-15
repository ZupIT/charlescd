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
import InputTitle from '../';

test('render inputTitle component in edit mode', () => {
  const props = {
    name: 'inputTitle'
  };

  render(<InputTitle name={props.name} />);

  const inputElement = screen.getByTestId(`input-text-${props.name}`);
  const saveButton = screen.getByText('Save');

  expect(inputElement).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
});


test('render inputTitle component in view mode', () => {
  const props = {
    name: 'inputTitle',
    defaultValue: 'value'
  };

  render(
    <InputTitle name={props.name} defaultValue={props.defaultValue} />
  );

  const saveButton = screen.queryByText('Save');
  const inputElement = screen.getByTestId(`input-text-${props.name}`);

  expect(saveButton).not.toBeInTheDocument();
  expect(inputElement).toBeInTheDocument();
});

test('click to save input title', () => {
  const props = {
    name: 'inputTitle',
    defaultValue: '',
    onClickSave: jest.fn()
  };

  render(
    <InputTitle name={props.name} defaultValue={props.defaultValue} onClickSave={props.onClickSave} />
  );

  const saveButton = screen.getByText('Save');
  const inputElement = screen.getByTestId(`input-text-${props.name}`);

  userEvent.type(inputElement, 'value');
  act(() => userEvent.click(saveButton));

  expect(props.onClickSave).toHaveBeenCalledTimes(1);
  expect(saveButton).not.toBeInTheDocument();
});


test('change input title to edit mode', () => {
  const props = {
    name: 'inputTitle',
    defaultValue: 'value'
  };

  render(
    <InputTitle name={props.name} defaultValue={props.defaultValue} />
  );

  const inputElement = screen.getByTestId(`input-text-${props.name}`);
  userEvent.click(inputElement);

  const saveButton = screen.getByText('Save');
  expect(saveButton).toBeInTheDocument();
});
