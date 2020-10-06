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
import userEvent from '@testing-library/user-event';
import { normalizeRGBColor, renderWithTheme, screen } from 'unit-test/testUtils';
import { getTheme } from "core/utils/themes";
import { ThemeScheme } from 'core/assets/themes';
import NavTabs from '..';

const theme = getTheme() as ThemeScheme;
const tabItemBorderColor = normalizeRGBColor(theme.navTabs.item.border);

test('render NavTabs default component', async () => {
  renderWithTheme(
    <NavTabs>
      <NavTabs.Tab title="Tab 1">
        Content 1
      </NavTabs.Tab>
      <NavTabs.Tab title="Tab 2">
        Content 2
      </NavTabs.Tab>
    </NavTabs>
  );
  
  const activeTabLabel = screen.getByTestId('tab-0');
  const firstTabContent = screen.getByText('Content 1');
  const secondTabContent = screen.queryByText('Content 2');

  expect(activeTabLabel).toHaveStyle(`border-bottom: 2px solid ${tabItemBorderColor}`);
  expect(firstTabContent).toBeInTheDocument();
  expect(secondTabContent).not.toBeInTheDocument();
});

test('render NavTabs and select a Tab', async () => {
  renderWithTheme(
    <NavTabs>
      <NavTabs.Tab title="Tab 1">
        Content 1
      </NavTabs.Tab>
      <NavTabs.Tab title="Tab 2">
        Content 2
      </NavTabs.Tab>
    </NavTabs>
  );
  
  const secondTab = screen.getByTestId('tab-1');

  userEvent.click(secondTab);
  
  const firstTabContent = screen.queryByText('Content 1');
  const secondTabContent = screen.getByText('Content 2');

  expect(secondTab).toHaveStyle(`border-bottom: 2px solid ${tabItemBorderColor}`);
  expect(firstTabContent).not.toBeInTheDocument();
  expect(secondTabContent).toBeInTheDocument();
});