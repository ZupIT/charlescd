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

import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { dark as checkboxTheme } from 'core/assets/themes/checkbox';
import Checkbox from '..'

const props = {
  name: 'deploy',
  value: 'DEPLOY',
  label: 'Deploy'
};

test('renders Checkbox default values', async () => {
  render(<Checkbox {...props} />);

  const element = await screen.findByTestId(`checkbox-${props.label}`);

  expect(element).toBeInTheDocument();
});

test('renders Checkbox default values and checked', async () => {
  render(<Checkbox {...props} defaultChecked />);

  const element = await screen.findByTestId(`checkbox-${props.label}`);
  const toggle = await screen.findByTestId(`checkbox-toggle-${props.label}`);

  expect(element).toBeInTheDocument();
  expect(toggle).toBeInTheDocument();
  expect(toggle).toHaveStyle(`background-color: ${checkboxTheme.checked.background}`);
});

test('renders Checkbox default values and try toggle', async () => {
  render(<Checkbox {...props} />);

  const element = await screen.findByTestId(`checkbox-${props.label}`);
  const input = await screen.findByTestId(`checkbox-input-${props.label}`);
  const toggle = await screen.findByTestId(`checkbox-toggle-${props.label}`);

  expect(element).toBeInTheDocument();
  expect(input).toBeInTheDocument();
  expect(toggle).toBeInTheDocument();

  expect(toggle).not.toHaveStyle(`background-color: ${checkboxTheme.checked.background}`);
  userEvent.click(input);
  expect(toggle).toHaveStyle(`background-color: ${checkboxTheme.checked.background}`);
  userEvent.click(input);
  expect(toggle).not.toHaveStyle(`background-color: ${checkboxTheme.checked.background}`);
});
