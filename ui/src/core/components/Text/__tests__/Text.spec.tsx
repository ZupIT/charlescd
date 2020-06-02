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
import Text from '../';
import { HEADINGS_FONT_SIZE } from '../enums';
import { dark as textTheme } from 'core/assets/themes/text';

test('renders text component with default properties', () => {
  const { getByText } = render(<Text.h1>hello</Text.h1>);

  const textElement = getByText('hello');
  expect(textElement).toHaveStyle(`color: ${textTheme.primary};`);
  expect(textElement).toHaveStyle('font-weight: normal;');
  expect(textElement).toHaveStyle(`font-size: ${HEADINGS_FONT_SIZE.h1};`);
  expect(textElement).toHaveStyle('text-align: left;');
});

test('renders text component with color, weight and align props', () => {
  const { getByText } = render(
    <Text.h2 color="dark" align="center" weight="bold">
      hello
    </Text.h2>
  );

  const textElement = getByText('hello');
  expect(textElement).toHaveStyle(`color: ${textTheme.dark};`);
  expect(textElement).toHaveStyle('font-weight: bold;');
  expect(textElement).toHaveStyle(`font-size: ${HEADINGS_FONT_SIZE.h2};`);
  expect(textElement).toHaveStyle('text-align: center;');
});

test('renders anothers text variations', () => {
  const { getAllByText } = render(
    <>
      <Text.h3>hello</Text.h3>
      <Text.h4>hello</Text.h4>
      <Text.h5>hello</Text.h5>
      <Text.h6>hello</Text.h6>
    </>
  );

  expect(getAllByText('hello').length).toBe(4);
});
