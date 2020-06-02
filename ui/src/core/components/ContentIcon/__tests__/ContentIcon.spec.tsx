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
import { renderWithTheme } from 'unit-test/testUtils';
import ContentIcon from '..';

test('renders ContentIcon component with default properties', () => {
  const { getByText, getByTestId } = renderWithTheme(
    <ContentIcon
      icon="charles"
    >
      <span>hello</span>
    </ContentIcon>
  );

  const childElement = getByText('hello');
  const contentElement = getByTestId('contentIcon-charles').querySelector(
    ':nth-child(2)'
  );
  const iconElement = getByTestId('icon-charles');

  expect(contentElement).toBeInTheDocument();
  expect(childElement).toBeInTheDocument();
  expect(iconElement).toBeInTheDocument();
});
