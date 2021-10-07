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
// @ts-nocheck


import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import TextArea from '..';

test('renders textarea component with default properties', () => {
  render(
    <TextArea name="keyName" autoComplete="off" />
  );

  const textareaElement = screen.getByTestId('textarea-keyName');
  expect(textareaElement).toBeInTheDocument();

});

test('renders textarea component as a resume', () => {
  render(
    <TextArea
      resume      
      name="keyName"
      autoComplete="off"
  />);

  const textareaElement = screen.getByTestId('textarea-keyName');

  expect(textareaElement).toBeInTheDocument();
  expect(textareaElement).toHaveStyle('background: transparent;');
  expect(textareaElement).toHaveStyle('border: none;');
});

test('renders textarea component with label', () => {
  const { container } = render(<TextArea name="keyName" label="Label" />);
  expect(container).toHaveTextContent('Label');
});

test('renders textarea component with label', () => {
  render(<TextArea name="keyName" label="Label" />);

  const element = screen.getByText('Label');
  expect(element).toBeInTheDocument();
});

test('floating label when textarea has value', () => {
  render(<TextArea name="keyName" defaultValue="value" label="Label" />);

  const labelElement = screen.getByText('Label');
  expect(labelElement).toHaveStyle('top: 0px;');
});