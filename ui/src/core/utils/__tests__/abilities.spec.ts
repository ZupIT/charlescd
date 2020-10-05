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

import { setAccessToken } from '../auth';
import { ability, setUserAbilities } from '../abilities';
import * as workspaceUtils from 'core/utils/workspace';
import { saveProfile } from '../profile';

const workspaceId = 'workspace-123'

beforeAll(() => {
  saveProfile(
    {
      id: '123',
      name: 'User',
      email: 'user@zup.com.br',
      workspaces: [
        {
          id: workspaceId,
          permissions: [
            'maintenance_write',
            'circles_read',
            'circles_write',
            'modules_read',
            'modules_write'
          ]
        }
      ]
    }
  );
});

test('set user abilities', () => {
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue(workspaceId);

  expect(ability.rules).toHaveLength(0);
  setUserAbilities();
  expect(ability.rules).toHaveLength(5);
});