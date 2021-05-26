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
import Text from '../';
import { baseFontSize } from '../constants';
import { dark as textTheme } from 'core/assets/themes/text';

test('renders text component with default properties', () => {
  render(<Text tag='H1'>hello</Text>);

  const textElement = screen.getByText('hello');
  expect(textElement).toHaveStyle(`color: ${textTheme.primary};`);
  expect(textElement).toHaveStyle('font-weight: normal;');
  expect(textElement).toHaveStyle(`font-size: ${baseFontSize.H1};`);
  expect(textElement).toHaveStyle('text-align: left;');
});

test('renders text component with color, weight and align props', () => {
  render(
    <Text tag='H2' color="dark" align="center" weight="bold">
      hello
    </Text>
  );

  const textElement = screen.getByText('hello');
  expect(textElement).toHaveStyle(`color: ${textTheme.dark};`);
  expect(textElement).toHaveStyle('font-weight: bold;');
  expect(textElement).toHaveStyle(`font-size: ${baseFontSize.H2};`);
  expect(textElement).toHaveStyle('text-align: center;');
});

test('renders anothers text variations', () => {
  render(
    <>
      <Text tag='H3'>hello</Text>
      <Text tag='H4'>hello</Text>
      <Text tag='H5'>hello</Text>
      <Text tag='H6'>hello</Text>
    </>
  );

  const textElements = screen.getAllByText('hello');
  expect(textElements).toHaveLength(4);
});