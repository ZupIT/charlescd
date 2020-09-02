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
import MutationObserver from 'mutation-observer';
import { FormContext, useForm } from 'react-hook-form';
import { render, fireEvent, screen } from 'unit-test/testUtils';
import Rule, { Props } from '../Rule';
import { renderHook } from '@testing-library/react-hooks';

(global as any).MutationObserver = MutationObserver

const props: Props = {
  prefixName: 'input-rule',
  viewMode: true,
  rule: {
    type: {
      condition: 'EQUAL',
      key: 'username',
      value: 'charlescd@zup.com.br',
    }
  }
}

test('render Rule default component', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  render(
    <FormContext { ...methods }>
      <Rule { ...props } />
    </FormContext>
  );

  const InputType = screen.getByTestId('input-hidden-input-rule.type');
  const InputKey = screen.getByTestId('input-text-input-rule.content.key');
  const WrapperCondition = screen.getByTestId('select-input-rule.content.condition');
  const InputValue = screen.getByTestId('input-text-input-rule.content.value[0]');
  
  expect(screen.getByTestId('segments-rules')).toBeInTheDocument();
  expect(InputType).toHaveAttribute('type', 'hidden');
  expect(InputKey).toBeInTheDocument();
  expect(InputKey).toHaveAttribute('type', 'text');
  expect(WrapperCondition).toBeInTheDocument();
  expect(InputValue).toBeInTheDocument();
});

test('render Rule default component with group', async () => {
  const { result } = renderHook(() => useForm());
  const onRemoveRule = jest.fn();
  const methods = result.current;

  render(
    <FormContext { ...methods }>
      <Rule { ...props } hasGroup onRemoveRule={onRemoveRule} />
    </FormContext>
  );

  const InputTrash = await screen.findByTestId('icon-trash');
  expect(InputTrash).toBeInTheDocument();

  fireEvent.click(InputTrash);
  expect(onRemoveRule).toBeCalled();
});