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
import { render, fireEvent, act, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import UserGroups from '../index';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});
  
test('render group user default page', async () => {
    render(
      <UserGroups />
    );

    const menu = screen.getByTestId('users-groups-menu');

    expect(menu).toBeInTheDocument();
});
  
test('render create group user', async () => {
    render(
      <UserGroups />
    );
    const createGroup = screen.getByTestId('button-default-create-user-group');
    
    expect(createGroup).toBeInTheDocument();
    fireEvent.click(createGroup);
    
    const createGroupModal = screen.getByTestId('modal-default');

    expect(createGroupModal).toBeInTheDocument();
});
