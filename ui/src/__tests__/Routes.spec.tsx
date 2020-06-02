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
import { render, wait } from 'unit-test/testUtils';
import Routes from '../Routes';

jest.mock('core/constants/routes', () => {
  return {
    routes: {
      baseName: '/',
      workspaces: '/workspaces',
      error403: '/error/403',
      error404: '/error/404'
    }
  };
});

test('render default route', async () => {
  const { container } = render(<Routes />);

  await wait(() => expect(container.innerHTML).toMatch('Error 403.'));
});
