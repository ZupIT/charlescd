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
import Page from '../';

test('renders Menu Page component with default properties', () => {
  const { getByText } = render(
    <Page>
      <Page.Menu>page menu</Page.Menu>
      <Page.Content>page content</Page.Content>
    </Page>
  );

  const menuElement = getByText('page menu');
  const contentElement = getByText('page content');
  expect(menuElement).toBeInTheDocument();
  expect(contentElement).toBeInTheDocument();
});

test('render circles Page placeholder', () => {
  const { getByText, getByTestId } = render(
    <Page.Placeholder
      icon='placeholder-circles'
      title='Tilte'
      subtitle='Subtitle'
      hasCards={true}
    />
  );

  const placeholderIcon = getByTestId('icon-placeholder-circles');
  const placeholderCards = getByTestId('circles');
  const placeholderTitle = getByText('Tilte');
  const placeholderSubtitle = getByText('Subtitle');
  expect(placeholderIcon).toBeInTheDocument();
  expect(placeholderCards).toBeInTheDocument();
  expect(placeholderTitle).toBeInTheDocument();
  expect(placeholderSubtitle).toBeInTheDocument();
});
