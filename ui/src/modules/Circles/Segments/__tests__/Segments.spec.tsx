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
import { render, fireEvent, wait, waitForElement } from 'unit-test/testUtils';
import Segments from '..';

(global as any).MutationObserver = MutationObserver;

test('render Segments default component', async () => {
  const { queryByTestId } = render(
    <Segments />
  );

  await wait(() => expect(queryByTestId('segments-rules')).not.toBeInTheDocument());
  await wait(() => expect(queryByTestId('input-text-logicalOperator')).not.toBeInTheDocument());
  await wait(() => expect(queryByTestId('input-hidden-type')).toBeInTheDocument());
  await wait(() => expect(queryByTestId('button-default-save')).not.toBeInTheDocument());
});

test('render Segments default component and shows logical operator OR', async () => {
  const { queryByTestId, getByTestId} = render(
    <Segments viewMode={false} />
  );
  
  const buttonAddRule = await waitForElement(() => queryByTestId('button-default-add-clause'));
  expect(buttonAddRule).toBeInTheDocument();
  fireEvent.click(buttonAddRule);

  const operator = getByTestId('input-text-clauses[0].logicalOperator');
  expect(operator).toHaveAttribute('value', 'OR');
})

test('render Segments default component with viewMode off', async () => {
  const { getByTestId } = render(
    <Segments viewMode={false} />
  );

  await wait(() => expect(getByTestId('segments-rules')).toBeInTheDocument());
  await wait(() => expect(getByTestId('input-text-logicalOperator')).toBeInTheDocument());
  await wait(() => expect(getByTestId('button-default-save')).toBeInTheDocument());
});

test('render Segments default component and Rules', async () => {
  const { getByTestId } = render(
    <Segments viewMode={false} />
  );

  const inputTypeText = 'input-hidden-clauses[0].type';
  const inputKeyText = 'input-text-clauses[0].content.key';
  const wrapperConditionText = 'select-clauses[0].content.condition';
  const inputValueText = 'input-text-clauses[0].content.value[0]';

  await wait(() => expect(getByTestId('segments-rules')).toBeInTheDocument());
  await wait(() => expect(getByTestId(inputTypeText)).toHaveAttribute('type', 'hidden'));
  await wait(() => expect(getByTestId(inputKeyText)).toBeInTheDocument());
  await wait(() => expect(getByTestId(inputKeyText)).toHaveAttribute('type', 'text'));
  await wait(() => expect(getByTestId(wrapperConditionText)).toBeInTheDocument());
  await wait(() => expect(getByTestId(inputValueText)).toBeInTheDocument());
});

test('render Segments default component and add new rule', async () => {
  const { getByTestId } = render(
    <Segments viewMode={false} />
  );

  const ButtonAddClause = await waitForElement(() => getByTestId('button-default-add-clause'));
  expect(ButtonAddClause).toBeInTheDocument();

  const KeyInput0 = await waitForElement(() => getByTestId('input-text-clauses[0].content.key'));
  expect(KeyInput0).toBeInTheDocument();

  fireEvent.click(ButtonAddClause);

  const KeyInput1 = await waitForElement(() => getByTestId('input-text-clauses[0].clauses[1].content.key'));
  expect(KeyInput1).toBeInTheDocument();
});

// render segments
// in edit mode, when I click inputoperator, should call changeOperatorValue()
// test('render Segments default component with viewMode off and change logical operator', async () => {
//   const changeOperatorValue = jest.fn();
//   const { getByTestId, debug } = render(
//     <Segments viewMode={false} />
//   );

//   const innerInputOperator = await waitForElement(() => getByTestId('input-text-clauses[0].logicalOperator'));
//   const outerInputOperator = await waitForElement(() => getByTestId('input-text-logicalOperator'));

//   fireEvent.click(innerInputOperator);
//   fireEvent.click(outerInputOperator);

//   debug()

//   expect(changeOperatorValue).toHaveBeenCalled();
// })
