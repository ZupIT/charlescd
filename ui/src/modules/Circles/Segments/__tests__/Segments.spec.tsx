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
import { render, fireEvent, wait, waitForElement, screen } from 'unit-test/testUtils';
import Segments from '..';

(global as any).MutationObserver = MutationObserver;

test('render Segments default component', async () => {
  render(<Segments />);

  await wait(() => expect(screen.queryByTestId('segments-rules')).not.toBeInTheDocument());
  await wait(() => expect(screen.queryByTestId('input-text-logicalOperator')).not.toBeInTheDocument());
  await wait(() => expect(screen.queryByTestId('input-hidden-type')).toBeInTheDocument());
  await wait(() => expect(screen.queryByTestId('button-default-save')).not.toBeInTheDocument());
});

test('render Segments default component, add new group and change group logical operator to AND', async () => {
  render(<Segments viewMode={false} />);

  const buttonAddGroup = await waitForElement(() => screen.getByText('Group'));
  fireEvent.click(buttonAddGroup);

  await waitForElement(() => screen.getByDisplayValue('OR'));

  const operator = await waitForElement(() => screen.getByTestId('input-text-logicalOperator'));
  fireEvent.click(operator);
  
  await waitForElement(() => screen.getByDisplayValue('AND'));
});

test('render Segments default component with viewMode off', async () => {
  render(<Segments viewMode={false} />);
    
  await wait(() => expect(screen.getByTestId('segments-rules')).toBeInTheDocument());
  await wait(() => expect(screen.getByTestId('input-text-logicalOperator')).toBeInTheDocument());
  await wait(() => expect(screen.getByTestId('button-default-save')).toBeInTheDocument());
});

test('render Segments default component and Rules', async () => {
  render(<Segments viewMode={false} />);
    
  const inputTypeText = 'input-hidden-clauses[0].type';
  const inputKeyText = 'input-text-clauses[0].content.key';
  const wrapperConditionText = 'select-clauses[0].content.condition';
  const inputValueText = 'input-text-clauses[0].content.value[0]';
  
  await wait(() => expect(screen.getByTestId('segments-rules')).toBeInTheDocument());
  await wait(() => expect(screen.getByTestId(inputTypeText)).toHaveAttribute('type', 'hidden'));
  await wait(() => expect(screen.getByTestId(inputKeyText)).toBeInTheDocument());
  await wait(() => expect(screen.getByTestId(inputKeyText)).toHaveAttribute('type', 'text'));
  await wait(() => expect(screen.getByTestId(wrapperConditionText)).toBeInTheDocument());
  await wait(() => expect(screen.getByTestId(inputValueText)).toBeInTheDocument());
});

test('render Segments default component, add new rule and shows logical operator OR', async () => {
  render(<Segments viewMode={false} />);
  
  const buttonAddRule = await waitForElement(() => screen.queryByTestId('button-default-add-clause'));
  expect(buttonAddRule).toBeInTheDocument();
  fireEvent.click(buttonAddRule);

  const operator = screen.getByTestId('input-text-clauses[0].logicalOperator');
  expect(operator).toHaveAttribute('value', 'OR');
});
  
test('render Segments default component and add new rule', async () => {
  render(<Segments viewMode={false} />);
    
  const ButtonAddClause = await waitForElement(() => screen.getByTestId('button-default-add-clause'));
  expect(ButtonAddClause).toBeInTheDocument();
  
  const KeyInput0 = await waitForElement(() => screen.getByTestId('input-text-clauses[0].content.key'));
  expect(KeyInput0).toBeInTheDocument();
  
  fireEvent.click(ButtonAddClause);
  
  const KeyInput1 = await waitForElement(() => screen.getByTestId('input-text-clauses[0].clauses[1].content.key'));
  expect(KeyInput1).toBeInTheDocument();
});

test('render Segments default component, add new rule and change logical operator to AND', async () => {
  render(<Segments viewMode={false} />);

  const buttonAddRule = await waitForElement(() => screen.getByTestId('button-default-add-clause'));
  fireEvent.click(buttonAddRule);

  const operator = screen.getByTestId('input-text-clauses[0].logicalOperator');
  expect(operator).toHaveAttribute('value', 'OR');

  fireEvent.click(operator);
  await waitForElement(() => screen.getByDisplayValue('AND'));
});