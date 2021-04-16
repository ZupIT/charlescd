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
import Item, { Props }  from '../Item';
import { FetchMock } from 'jest-fetch-mock/types';
import { COLOR_MOUNTAIN_MEADOW } from 'core/assets/colors';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const props: Props = {
  selected: false,
  workspace: {
    id: '123',
    name: 'workspace',
    authorEmail: 'charlescd@zup.com.br',
    users: null,
    status: 'COMPLETE'
  },
  onChange: jest.fn(),
}

test('Render Item default: unchecked', async () => {
  render(<Item {...props} />);

  const Content = await screen.findByTestId(`item-${props.workspace.id}`);
  expect(Content).toBeInTheDocument();
  
  const ButtonUnchecked = await screen.findByTestId('icon-plus-circle');
  expect(ButtonUnchecked).toBeInTheDocument();

  const ButtonChecked = screen.queryByTestId('icon-checkmark-circle');
  expect(ButtonChecked).not.toBeInTheDocument();
});

test('Render Item: checked', async () => {
  render(<Item {...{...props, selected: true }} />);
  
  const ButtonUnchecked = screen.queryByTestId('icon-plus-circle');
  expect(ButtonUnchecked).not.toBeInTheDocument();

  const ButtonChecked = await screen.findByTestId('icon-checkmark-circle');
  expect(ButtonChecked).toBeInTheDocument();
  expect(ButtonChecked).toHaveStyle(`color: ${COLOR_MOUNTAIN_MEADOW}`);
});

