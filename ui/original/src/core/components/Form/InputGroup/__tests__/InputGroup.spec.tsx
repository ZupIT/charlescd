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
import InputGroup from '..';

const props = {
  defaultValue: 'darwin-ui'
};

test('renders InputGroup component', () => {
  render(<InputGroup {...props} />);

  const element = screen.getByTestId(`input-group-${props.defaultValue}`);
  const appendElement = screen.queryByTestId(`input-group-${props.defaultValue}-append`);
  const prependElement = screen.queryByTestId(`input-group-${props.defaultValue}-prepend`);

  expect(element).toBeInTheDocument();
  expect(appendElement).not.toBeInTheDocument();
  expect(prependElement).not.toBeInTheDocument();
});

test('renders InputGroup component with append', () => {
  render(<InputGroup {...props} append="ZupIT" />);

  const element = screen.getByTestId(`input-group-${props.defaultValue}`);
  const appendElement = screen.getByTestId(`input-group-${props.defaultValue}-append`);
  const prependElement = screen.queryByTestId(`input-group-${props.defaultValue}-prepend`);

  expect(element).toBeInTheDocument();
  expect(appendElement).toBeInTheDocument();
  expect(prependElement).not.toBeInTheDocument();
});

test('renders InputGroup component with prepend', () => {
  render(<InputGroup {...props} prepend="ZupIT" />);

  const element = screen.getByTestId(`input-group-${props.defaultValue}`);
  const appendElement = screen.queryByTestId(`input-group-${props.defaultValue}-append`);
  const prependElement = screen.getByTestId(`input-group-${props.defaultValue}-prepend`);

  expect(element).toBeInTheDocument();
  expect(appendElement).not.toBeInTheDocument();
  expect(prependElement).toBeInTheDocument();
});