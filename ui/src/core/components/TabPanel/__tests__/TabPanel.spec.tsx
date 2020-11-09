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
import userEvent from '@testing-library/user-event';
import TabPanel from '../';


test('render TabPanel default component loading mode', () => {
  const Children = <div>children</div>;

  render(
    <TabPanel title="Circle" children={Children} name="charles" />
  );

  expect(screen.getByText('Circle')).toBeInTheDocument();
  expect(screen.queryByTestId('icon-cancel')).not.toBeInTheDocument();
  expect(screen.getByText('children')).toBeInTheDocument();
  expect(screen.queryByTestId('button')).not.toBeInTheDocument();
});

test('render TabPanel default component with action', () => {
  const action = jest.fn();
  const Children = <div>children</div>;

  render(
    <TabPanel title="Circle" name="charles" size="15px" children={Children} onClose={action} />
  );

  const tabpanelBtnClose = screen.getByTestId('icon-cancel');

  expect(tabpanelBtnClose).toBeInTheDocument();
  userEvent.click(tabpanelBtnClose);
  expect(action).toBeCalledTimes(1);
});
