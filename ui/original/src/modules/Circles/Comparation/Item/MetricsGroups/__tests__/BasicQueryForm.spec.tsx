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
import { FormContextMock } from 'unit-test/form-context.mock';
import { render, screen } from 'unit-test/testUtils';
import BasicQueryForm from "../BasicQueryForm";

test('render BasicQueryForm', () => {
  render(
    <FormContextMock>
      <BasicQueryForm />
    </FormContextMock>
  );

  const addButton = screen.getByTestId('icon-add');
  const filterFields = screen.queryByTestId('segments-rules');
  expect(addButton).toBeInTheDocument();
  expect(filterFields).not.toBeInTheDocument();
});

test('render BasicQueryForm and add/remove fields', () => {
  render(
    <FormContextMock>
      <BasicQueryForm />
    </FormContextMock>
  );

  const addButton = screen.getByTestId('icon-add');
  userEvent.click(addButton);

  const trashButton = screen.getByTestId('icon-trash');
  const filterFields = screen.getByTestId('segments-rules');
  const nameField = screen.getByTestId('input-hidden-filters[0].id');
  const selectField = screen.getByTestId('select-filters[0].operator');
  const valueField = screen.getByTestId('label-text-filters[0].value');
  
  expect(filterFields).toBeInTheDocument();
  expect(nameField).toBeInTheDocument();
  expect(selectField).toBeInTheDocument();
  expect(valueField).toBeInTheDocument();

  userEvent.click(trashButton);

  expect(filterFields).not.toBeInTheDocument();
  expect(nameField).not.toBeInTheDocument();
  expect(selectField).not.toBeInTheDocument();
  expect(valueField).not.toBeInTheDocument();
});