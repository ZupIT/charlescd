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
import { render } from 'unit-test/testUtils';
import Input from '..';

const textProps = {
  type: 'text',
  name: 'name',
  label: 'label',
  value: 'value'
};

const inputProps = {
  type: 'text',
  name: 'keyName'
};

test('renders Input component with default properties', () => {
  const { getByTestId } = render(
    <Input name="keyName" autoComplete="off" />
  );

  const inputElement = getByTestId(`input-${inputProps.type}-${inputProps.name}`);
  expect(inputElement).toBeInTheDocument();
});

test('renders Input component as a resume', () => {
  const { getByTestId } = render(
    <Input
      resume
      type={textProps.type}
      name={textProps.name}
      autoComplete="off"
    />
  );

  const inputElement = getByTestId(`input-${textProps.type}-${textProps.name}`);
  expect(inputElement).toBeInTheDocument();
  expect(inputElement).toHaveStyle('background: transparent;');
  expect(inputElement).toHaveStyle('border: none;');
});

test('renders Input component with label', () => {
  const { container } = render(<Input name="keyName" label="Label" />);
  expect(container).toHaveTextContent('Label');
});

test('floating label when Input has value', () => {
  const { container } = render(<Input name="keyName" defaultValue="value" label="Label" />);

  const labelElement = container.getElementsByTagName('label').item(0);
  const labelStyle = window.getComputedStyle(labelElement);
  expect(labelStyle.top).toBe('0px');
});
