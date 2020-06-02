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
import { render, wait } from 'unit-test/testUtils';
import { getTheme } from "core/utils/themes";
import Icon from '../index';

test('renders icon component with default properties', () => {
  const props = {
    name: 'menu'
  };
  const { getByTestId } = render(<Icon {...props} />);
  const icon = getByTestId(`icon-${props.name}`);
  const svg = icon.querySelector('svg');
  const svgStyle = window.getComputedStyle(svg);
  const iconStyle = window.getComputedStyle(icon);

  expect(svgStyle.width).toBe('');
  expect(svgStyle.height).toBe('');
  expect(iconStyle.color).toBe('');
});

test('renders icon component with properties', async () => {
  const theme = getTheme()
  const props = {
    name: 'menu',
    size: '200px',
    color: 'error' as 'error'
  };
  const { getByTestId } = render(<Icon {...props} />);

  await wait();

  const icon = getByTestId(`icon-${props.name}`);
  const svg = icon.querySelector('svg');

  const svgStyle = window.getComputedStyle(svg);
  const iconStyle = window.getComputedStyle(icon);

  expect(svgStyle.width).toBe(props.size);
  expect(svgStyle.height).toBe(props.size);
  expect(iconStyle.color).toBe(theme.icon[props.color]);
});
