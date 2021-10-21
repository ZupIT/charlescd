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
import { render, screen} from 'unit-test/testUtils';
import { getTheme } from "core/utils/themes";
import Icon from '../';

test('renders icon component with default properties', () => {
  const props = {
    name: 'menu'
  };
  render(<Icon {...props} />);

  const icon = screen.getByTestId(`icon-${props.name}`);
  const svg = icon.querySelector('svg');

  expect(svg).toHaveStyle('width: "";');
  expect(svg).toHaveStyle('height: "";');
  expect(icon).toHaveStyle('color: "";');
});

test('renders icon component with properties', () => {
  const theme = getTheme()
  const props = {
    name: 'menu',
    size: '200px',
    color: 'error' as 'error'
  };
  render(<Icon {...props} />);

  const icon = screen.getByTestId(`icon-${props.name}`);
  const svg = icon.querySelector('svg');

  expect(svg).toHaveStyle(`width: ${props.size};`);
  expect(svg).toHaveStyle(`height: ${props.size};`);
  expect(icon).toHaveStyle(`color: ${theme.icon[props.color]};`);
});
