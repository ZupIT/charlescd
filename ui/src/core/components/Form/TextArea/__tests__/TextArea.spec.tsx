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
import TextArea from '..';

test('renders textarea component with default properties', () => {
  const { getByTestId } = render(
    <TextArea name="keyName" autoComplete="off" />
  );

  const textareaElement = getByTestId('textarea-keyName');
  expect(textareaElement).toBeInTheDocument();
});

test('renders textarea component as a resume', () => {
  const { getByTestId } = render(
      <TextArea
        resume      
        name="keyName"
        autoComplete="off"
    />);

  const textareaElement = getByTestId('textarea-keyName');
  expect(textareaElement).toBeInTheDocument();
  expect(textareaElement).toHaveStyle('background: transparent;');
  expect(textareaElement).toHaveStyle('border: none;');
});

test('renders textarea component with label', () => {
  const { container } = render(<TextArea name="keyName" label="Label" />);
  expect(container).toHaveTextContent('Label');
});

test('floating label when textarea has value', () => {
  const { container } = render(<TextArea name="keyName" defaultValue="value" label="Label" />);

  const labelElement = container.getElementsByTagName('label').item(0);
  const labelStyle = window.getComputedStyle(labelElement);
  expect(labelStyle.top).toBe('0px');
});
