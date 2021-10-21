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

import { render, screen } from 'unit-test/testUtils';
import { FormProvider, useForm } from 'react-hook-form';
import { renderHook } from '@testing-library/react-hooks';
import forEach from 'lodash/forEach';
import capitalize from 'lodash/capitalize';
import Scopes from '..';
import userEvent from '@testing-library/user-event';
import { subjects } from 'core/utils/abilities';

test('should render Scopes in create mode', async () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="create" />
    </FormProvider>
  );

  forEach(subjects, (subject) => {
    expect(screen.getByText(capitalize(subject))).toBeInTheDocument()
  });
});

test('should check modules_write and modules_read when check Modules', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="create" />
    </FormProvider>
  );

  const modules = screen.getByText('Modules');
  userEvent.click(modules);

  expect(methods.getValues('permissions')).toEqual(['modules_write', 'modules_read']);
});

test('should uncheck modules_write and modules_read when uncheck Modules', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="create" />
    </FormProvider>
  );

  const modules = screen.getByText('Modules');
  userEvent.click(modules);

  expect(methods.getValues('permissions')).toEqual(['modules_write', 'modules_read']);

  userEvent.click(modules);

  expect(methods.getValues('permissions')).toEqual([]);
});

test('should uncheck modules_write and modules_read when uncheck Modules > Read', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="create" />
    </FormProvider>
  );

  const modules = screen.getByText('Modules');
  const check = screen.getByDisplayValue('modules_read');

  userEvent.click(modules);

  expect(methods.getValues('permissions')).toEqual(['modules_write', 'modules_read']);

  userEvent.click(check);

  expect(methods.getValues('permissions')).toEqual([]);
});


test('should check modules_read when uncheck Modules > Write', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="create" />
    </FormProvider>
  );

  const modules = screen.getByText('Modules');
  const check = screen.getByDisplayValue('modules_write');

  userEvent.click(modules);

  expect(methods.getValues('permissions')).toEqual(['modules_write', 'modules_read']);

  userEvent.click(check);

  expect(methods.getValues('permissions')).toEqual(['modules_read']);
});

test('should check modules_read and Modules when check Modules > Write', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="create" />
    </FormProvider>
  );

  const modules = screen.getByTestId('checkbox-input-Modules');
  const check = screen.getByDisplayValue('modules_write');
  userEvent.click(check);

  expect(methods.getValues('permissions')).toEqual(['modules_write', 'modules_read']);
  expect(modules).toBeChecked();
});

test('should render Scopes in view mode', () => {
  const { result } = renderHook(() => useForm({
    defaultValues: {
      permissions: ['modules_write', 'modules_read', 'circles_read']
    }
  }));
  const methods = result.current;

  render(
    <FormProvider { ...methods }>
      <Scopes mode="view" />
    </FormProvider>
  );

  const modules = screen.getByTestId('modules');
  const circles = screen.getByTestId('circles');

  expect(modules).toHaveTextContent('ModulesAll permissions');
  expect(circles).toHaveTextContent('CirclesRead');
});