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
import Button from 'core/components/Button';

test('render Button default component', async () => {
  const click = jest.fn();
  const id = 'test';
  const { getByTestId } = render(
    <Button.Default id={id} onClick={click}>button</Button.Default>
  );

  const ButtonDefault = getByTestId(`button-default-${id}`);

  expect(ButtonDefault).toBeInTheDocument();
  fireEvent.click(ButtonDefault);
  expect(click).toBeCalled();
});

test('render Button default in disabled mode', () => {
  const click = jest.fn();
  const { getByTestId } = render(
    <Button.Default id="test" onClick={click} isDisabled={true}>button</Button.Default>
  );

  fireEvent.click(getByTestId('button-default-test'));
  expect(click).not.toBeCalled();
});

test('render Button default in loading mode', () => {
  const { getByTestId } = render(
    <Button.Default id="test" isLoading={true}>button</Button.Default>
  );

  const ButtonDefault = getByTestId('button-default-test');
  const loading = ButtonDefault.querySelector('svg');

  expect(loading).toBeInTheDocument();
});