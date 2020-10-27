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
import Log from '../';

test('render default component with error log', () => {
  const type = 'error';
  const content = 'Connection failed. Check if the configuration information is correct and try again';

  render(<Log type={type} content={content} />);
  
  const errorIcon = screen.getByTestId('icon-error');
  expect(errorIcon).toBeInTheDocument();

  const logText = screen.getByText(content);
  expect(logText).toBeInTheDocument();
  expect(logText).toHaveStyle('text-overflow: ellipsis');

  const element = screen.getByTestId('log-error');
  expect(element).toHaveStyle('background-color: rgb(255, 69, 58)');
  expect(element).toHaveStyle('color: #FFF');
})

test('render default component with warning log', () => {
  const type = 'warning';
  const content = 'Warning: Check if the configuration information is correct and try again';

  render(<Log type={type} content={content} />);
  
  const warningIcon = screen.getByTestId('icon-warning');
  expect(warningIcon).toBeInTheDocument();

  const logText = screen.getByText(content);
  expect(logText).toBeInTheDocument();
  expect(logText).toHaveStyle('text-overflow: ellipsis');

  const element = screen.getByTestId('log-warning');
  expect(element).toHaveStyle('background-color: #FFD60A');
  expect(element).toHaveStyle('color: #3A3A3C');
})