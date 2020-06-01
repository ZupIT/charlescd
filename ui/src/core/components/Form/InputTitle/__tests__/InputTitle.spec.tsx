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
import InputTitle from '../';

test('render inputTitle component in edit mode', () => {
  const props = {
    name: 'inputTitle'
  };
  const { getByTestId, getByText } = render(
    <InputTitle name={props.name} />
);

  const inputElement = getByTestId(`input-text-${props.name}`);
  const saveButton = getByText('Save');

  expect(saveButton).toBeInTheDocument();
  expect(inputElement).toBeInTheDocument();
});


test('render inputTitle component in view mode', () => {
  const props = {
    name: 'inputTitle',
    defaultValue: 'value'
  };
  const { getByTestId, queryByText } = render(
    <InputTitle name={props.name} defaultValue={props.defaultValue} />
  );

  const saveButton = queryByText('Save');

  const inputElement = getByTestId(`input-text-${props.name}`);
  expect(saveButton).toBeInTheDocument();
  expect(inputElement).toBeInTheDocument();
});

test('click to save input title', () => {
  const props = {
    name: 'inputTitle',
    defaultValue: '',
    onClickSave: jest.fn()
  };
  const { getByTestId, queryByText } = render(
    <InputTitle name={props.name} defaultValue={props.defaultValue} onClickSave={props.onClickSave} />
  );
  const saveButton = queryByText('Save');
  const inputElement = getByTestId(`input-text-${props.name}`);
  fireEvent.change(inputElement, { target: { value: 'value' } });

  fireEvent.click(saveButton);

  expect(props.onClickSave).toHaveBeenCalled();
  expect(saveButton).not.toBeInTheDocument();
});


test('change input title to edit mode', () => {
  const props = {
    name: 'inputTitle',
    defaultValue: 'value'
  };
  const { getByTestId, getByText } = render(
    <InputTitle name={props.name} defaultValue={props.defaultValue} />
  );
  const inputElement = getByTestId(`input-text-${props.name}`);
  fireEvent.click(inputElement);

  expect(getByText('Save')).toBeInTheDocument();
});
