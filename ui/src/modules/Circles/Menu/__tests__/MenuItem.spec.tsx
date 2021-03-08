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

import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import * as pathUtils from 'core/utils/path';
import MenuItem from '../MenuItem';
import routes from 'core/constants/routes';

test('render MenuItem', async () => {
  const addParamSpy = jest.spyOn(pathUtils, 'addParam');

  render(<MenuItem id="1" name="circle" />);

  userEvent.click(screen.getByTestId('menu-item-circle-1'));

  expect(screen.getByTestId('icon-circle-menu')).toBeInTheDocument();
  expect(screen.getByText('circle')).toBeInTheDocument();
  expect(addParamSpy).toHaveBeenCalledWith(
    'circle',
    routes.circlesComparation,
    expect.anything(),
    '1'
  );
});

test('render MenuItem when is active ', async () => {
  window.history.pushState({}, 'Circles page', '/circles/compare?circle=1');

  const delParamSpy = jest.spyOn(pathUtils, 'delParam');

  render(<MenuItem id="1" name="circle" />);

  userEvent.click(screen.getByTestId('menu-item-circle-1'));

  expect(delParamSpy).toHaveBeenCalledWith(
    'circle',
    routes.circlesComparation,
    expect.anything(),
    '1'
  );
});
