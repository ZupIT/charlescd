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

import { render, screen, waitFor, act, fireEvent } from 'unit-test/testUtils';
import Tab from '../Tab';
import userEvent from '@testing-library/user-event';
import 'unit-test/setup-msw';
import Footer from 'modules/Main/Footer';
import { saveProfile } from 'core/utils/profile';
import { setUserAbilities } from 'core/utils/abilities';
import { rest, server } from 'mocks/server';
import { DEFAULT_TEST_BASE_URL } from 'setupTests';

beforeEach(() => {
  saveProfile({ id: '123', name: 'charles admin', email: 'charlesadmin@admin', root: true});
  setUserAbilities();
})

test('render Modules comparation Tab', async () => {
  render(<Tab param="123" />);

  const dropdownElement = await screen.findByTestId('icon-vertical-dots');
  userEvent.click(dropdownElement);

  const dropdownItemEdit = screen.getByText('Edit');
  const dropdownItemDelete = screen.getByText('Delete');
  const dropdownItemCopyID = screen.getByText('Copy ID');

  expect(dropdownItemEdit).toBeInTheDocument();
  expect(dropdownItemDelete).toBeInTheDocument();
  expect(dropdownItemCopyID).toBeInTheDocument();

  const tabpanel = await screen.findByTestId('tabpanel-Untitled');
  expect(tabpanel).toBeInTheDocument();
});

test('should show notification when deleting a module', async () => {
  console.log('URL DELETE:', `${DEFAULT_TEST_BASE_URL}/moove/v2/modules/:moduleId`)
  server.use(
    rest.delete(`${DEFAULT_TEST_BASE_URL}/moove/v2/modules/123`, (req, res, ctx) => {
      console.log('****HERE DELETE SERVER USE')
      return res(
        ctx.status(204)
      )
    })
  )

  const {rerender}  = render(
    <div>
      <Tab param="123" />
      <Footer />
    </div>
  );
  
  await waitFor(() => expect(screen.getByText('Git URL')).toBeInTheDocument());

  const dropdownElement = await screen.findByTestId('icon-vertical-dots');
  fireEvent.click(dropdownElement);

  screen.debug()
  const dropdownItemEdit = screen.getByText('Edit');
  const dropdownItemDelete = screen.getByText('Delete');
  const dropdownItemCopyID = screen.getByText('Copy ID');

  expect(dropdownItemEdit).toBeInTheDocument();
  expect(dropdownItemDelete).toBeInTheDocument();
  expect(dropdownItemCopyID).toBeInTheDocument();

  fireEvent.click(dropdownItemDelete);
  
  // rerender(
  //   <div>
  //     <Tab param="123" />
  //     <Footer />
  //   </div>
  // );

  // screen.debug();
  expect(await screen.findByText('The module module 1 has been deleted')).toBeInTheDocument();
});
