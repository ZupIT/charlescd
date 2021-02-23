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
import * as pathUtils from 'core/utils/path';
import routes from 'core/constants/routes';
import MenuItem from '../MenuItem';

test('should render MenuItem', async () => {
  const addParamSpy = jest.spyOn(pathUtils, 'addParam');

  render(<MenuItem id="1" name="charlesadmin" email="charlesadmin@admin" />);

  userEvent.click(screen.getByTestId('menu-users-charlesadmin@admin'));

  expect(screen.getByTestId('icon-user')).toBeInTheDocument();
  expect(screen.getByText('charlesadmin')).toBeInTheDocument();

  expect(addParamSpy).toHaveBeenCalledWith(
    'user',
    routes.usersComparation,
    expect.anything(),
    '1'
  );
});
