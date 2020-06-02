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
import { render, fireEvent, wait } from 'unit-test/testUtils';
import TabPanel from '../';


test('render TabPanel default component loading mode', async () => {
  const Children = <div>children</div>;

  const { getByText, queryByTestId } = render(
    <TabPanel title="Circle" children={Children} name="charles" />
  );

  await wait(() => expect(getByText('Circle')).toBeInTheDocument());
  expect(getByText('children')).toBeInTheDocument();
  expect(queryByTestId('button')).not.toBeInTheDocument();
});

test('render TabPanel default component with action', async () => {
  const action = jest.fn();
  const Children = <div>children</div>;

  const { getAllByText, queryByTestId } = render(
    <TabPanel title="Circle" name="charles" size="15px" children={Children} onClose={action} />
  );

  const tabpanelBtnClose = queryByTestId('icon-cancel');

  await wait(() => expect(tabpanelBtnClose).toBeInTheDocument());
  fireEvent.click(tabpanelBtnClose);
  expect(action).toBeCalled();
});
