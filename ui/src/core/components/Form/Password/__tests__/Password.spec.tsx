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
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
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
  render(
    <Password type={textProps.type} name={textProps.name} autoComplete="off" />
  );

  const PasswordElement = screen.getByTestId('input-text-name');
  expect(PasswordElement).toBeInTheDocument();
});

test('render Password component as a resume', () => {
  render(
      <Password
        resume
        type="text"
        name="keyName"
        autoComplete="off"
    />);

    const passwordElement = screen.getByTestId('input-text-keyName');

    expect(passwordElement).toBeInTheDocument();
    expect(passwordElement).toHaveStyle('background: transparent;');
    expect(passwordElement).toHaveStyle('border: none;');
});

test('render Password component with label', () => {
  render(
    <Password
      type={textProps.type}
      name={textProps.name}
      label={textProps.label}
    />
  );
  const labelText = screen.getByText('label');
  expect(labelText).toBeInTheDocument();
});

test('render Password component with value floating the label', () => {
  render(
    <Password
      type={textProps.type}
      name={textProps.name}
      defaultValue={textProps.value}
      label={textProps.label}
    />
  );

  const labelElement = screen.getByText('label');
  expect(labelElement).toHaveStyle('top: 0px;');
});

test('render Password with type password', () => {
  render(
    <Password
      type={passwordProps.type}
      name={passwordProps.name}
      label={passwordProps.name}
    />
  );

  const testId = `input-${passwordProps.type}-${passwordProps.name}`;
  const passwordElement = screen.getByTestId(testId);

  expect(passwordElement).toBeInTheDocument();
});

test('render Password with type password toggle hidden value', () => {
  render(
    <Password
      type={passwordProps.type}
      name={passwordProps.name}
      label={passwordProps.name}
    />
  );

  const testId = `input-${passwordProps.type}-${passwordProps.name}`;
  const passwordElement = screen.getByTestId(testId);
  const showButtonElement = screen.getByTestId('icon-no-view');

  expect(passwordElement).toBeInTheDocument();
  expect(passwordElement).toHaveAttribute('type', passwordProps.type);
  expect(showButtonElement).toBeInTheDocument();

  userEvent.click(showButtonElement);

  const hiddenButtonElement = screen.getByTestId('icon-view');
  expect(hiddenButtonElement).toBeInTheDocument();
  expect(passwordElement).toHaveAttribute('type', textProps.type);
});
