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
import Password from '..';

const textProps = {
  type: 'text',
  name: 'name',
  label: 'label',
  value: 'value'
};

const passwordProps = {
  type: 'password',
  name: 'keyName'
};

test('render Password component with default properties', () => {
  const { getByTestId } = render(
    <Password type={textProps.type} name={textProps.name} autoComplete="off" />
  );

  const PasswordElement = getByTestId('input-text-name');
  expect(PasswordElement).toBeInTheDocument();
});

test('render Password component as a resume', () => {
  const { getByTestId } = render(
      <Password
        resume
        type="text"
        name="keyName"
        autoComplete="off"
    />);

  const PasswordElement = getByTestId('input-text-keyName');
  expect(PasswordElement).toBeInTheDocument();
  expect(PasswordElement).toHaveStyle('background: transparent;');
  expect(PasswordElement).toHaveStyle('border: none;');
});

test('render Password component with label', () => {
  const { container } = render(
    <Password
      type={textProps.type}
      name={textProps.name}
      label={textProps.label}
    />
  );
  expect(container).toHaveTextContent('label');
});

test('render Password component with value floating the label', () => {
  const { container } = render(
    <Password
      type={textProps.type}
      name={textProps.name}
      defaultValue={textProps.value}
      label={textProps.label}
    />
  );

  const labelElement = container.getElementsByTagName('label').item(0);
  const labelStyle = window.getComputedStyle(labelElement);
  expect(labelStyle.top).toBe('0px');
});

test('render Password with type password', () => {
  const { getByTestId } = render(
    <Password
      type={passwordProps.type}
      name={passwordProps.name}
      label={passwordProps.name}
    />
  );

  const PasswordElement = getByTestId(
    `input-${passwordProps.type}-${passwordProps.name}`
  );
  expect(PasswordElement).toBeInTheDocument();
});

test('render Password with type password toggle hidden value', () => {
  const { queryByTestId } = render(
    <Password
      type={passwordProps.type}
      name={passwordProps.name}
      label={passwordProps.name}
    />
  );

  const PasswordElement = queryByTestId(
    `input-${passwordProps.type}-${passwordProps.name}`
  );
  const showButtonElement = queryByTestId('icon-no-view');
  expect(showButtonElement).toBeInTheDocument();
  expect(PasswordElement).toHaveAttribute('type', passwordProps.type);
  expect(PasswordElement).toBeInTheDocument();

  fireEvent.click(showButtonElement);

  const hiddenButtonElement = queryByTestId('icon-view');
  expect(hiddenButtonElement).toBeInTheDocument();
  expect(PasswordElement).toHaveAttribute('type', textProps.type);
});
