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
import { render, fireEvent, screen } from 'unit-test/testUtils';
import Segments from '..';

(global as any).MutationObserver = MutationObserver;

test('render Segments default component', () => {
  render(<Segments />);

  expect(screen.queryByTestId('segments-rules')).not.toBeInTheDocument();
  expect(screen.queryByTestId('input-text-logicalOperator')).not.toBeInTheDocument();
  expect(screen.getByTestId('input-hidden-type')).toBeInTheDocument();
  expect(screen.queryByTestId('button-default-save')).not.toBeInTheDocument();
});

test('render Segments default component, add new group and change group logical operator', () => {
  render(<Segments viewMode={false} />);

  const buttonAddGroup = screen.getByText('Group');
  fireEvent.click(buttonAddGroup);

  expect(screen.getByDisplayValue('OR')).toBeInTheDocument();

  const operator = screen.getByTestId('input-text-logicalOperator');
  fireEvent.click(operator);
  
  expect(screen.getByDisplayValue('AND')).toBeInTheDocument();
});

test('render Segments default component with viewMode off', () => {
  render(<Segments viewMode={false} />);
    
  expect(screen.getByTestId('segments-rules')).toBeInTheDocument();
  expect(screen.getByTestId('input-text-logicalOperator')).toBeInTheDocument();
  expect(screen.getByTestId('button-default-save')).toBeInTheDocument();
});

test('render Segments default component and Rules', () => {
  render(<Segments viewMode={false} />);
    
  const inputTypeText = 'input-hidden-clauses[0].type';
  const inputKeyText = 'input-text-clauses[0].content.key';
  const wrapperConditionText = 'select-clauses[0].content.condition';
  const inputValueText = 'input-text-clauses[0].content.value[0]';
  
  expect(screen.getByTestId('segments-rules')).toBeInTheDocument();
  expect(screen.getByTestId(inputTypeText)).toHaveAttribute('type', 'hidden');
  expect(screen.getByTestId(inputKeyText)).toBeInTheDocument();
  expect(screen.getByTestId(inputKeyText)).toHaveAttribute('type', 'text');
  expect(screen.getByTestId(wrapperConditionText)).toBeInTheDocument();
  expect(screen.getByTestId(inputValueText)).toBeInTheDocument();
});

test('render Segments default component and add new rule', () => {
  render(<Segments viewMode={false} />);
    
  const KeyInput0 = screen.getByTestId('input-text-clauses[0].content.key');
  expect(KeyInput0).toBeInTheDocument();
  
  const ButtonAddRule = screen.getByTestId('button-default-add-clause');
  expect(ButtonAddRule).toBeInTheDocument();
  fireEvent.click(ButtonAddRule);
  
  const KeyInput1 = screen.getByTestId('input-text-clauses[0].clauses[1].content.key');
  expect(KeyInput1).toBeInTheDocument();
});

test('render Segments default component, add new rule and shows logical operator OR', () => {
  render(<Segments viewMode={false} />);
  
  const buttonAddRule = screen.getByTestId('button-default-add-clause');
  expect(buttonAddRule).toBeInTheDocument();
  fireEvent.click(buttonAddRule);

  const operator = screen.getByTestId('input-text-clauses[0].logicalOperator');
  expect(operator).toHaveAttribute('value', 'OR');
});

test('render Segments default component, add new rule and change logical operator', () => {
  render(<Segments viewMode={false} />);

  const buttonAddRule = screen.getByTestId('button-default-add-clause');
  fireEvent.click(buttonAddRule);

  const operator = screen.getByTestId('input-text-clauses[0].logicalOperator');
  expect(operator).toHaveAttribute('value', 'OR');
  fireEvent.click(operator);

  expect(screen.getByDisplayValue('AND')).toBeInTheDocument();
});