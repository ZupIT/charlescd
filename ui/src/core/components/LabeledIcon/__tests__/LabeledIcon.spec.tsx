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
import LabeledIcon from '../';

test('renders LabeledIcon component with default properties', () => {
  render(
    <LabeledIcon
      icon="charles"
    >
      <span>hello</span>
    </LabeledIcon>
  );

  const textElement = screen.getByText('hello');
  const labelElement = screen.getByTestId('labeledIcon-charles').querySelector(':nth-child(2)');
  const iconElement = screen.getByTestId('icon-charles');

  expect(textElement).toBeInTheDocument();
  expect(labelElement).toBeInTheDocument();
  expect(labelElement).toHaveStyle('margin-left: 5px;');
  expect(iconElement).toBeInTheDocument();
});

test('renders LabeledIcon component with marginContent', () => {
  render(
    <LabeledIcon
      icon="charles"
      marginContent="20px"
    >
      <span>hello</span>
    </LabeledIcon>
  );

  const textElement = screen.getByText('hello');
  const labelElement = screen.getByTestId('labeledIcon-charles').querySelector(':nth-child(2)');
  const iconElement = screen.getByTestId('icon-charles');

  expect(textElement).toBeInTheDocument();
  expect(labelElement).toBeInTheDocument();
  expect(labelElement).toHaveStyle('margin-left: 20px;');
  expect(iconElement).toBeInTheDocument();
});
