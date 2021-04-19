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

import { render, screen, waitFor } from 'unit-test/testUtils';
import { MemoryRouter } from 'react-router-dom';
import Token from '../index';
import 'unit-test/setup-msw';
import routes from 'core/constants/routes';
import { saveProfile } from 'core/utils/profile';
import userEvent from '@testing-library/user-event';
import { server, rest } from 'mocks/server';
import { DEFAULT_TEST_BASE_URL } from 'setupTests';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import { act } from 'react-dom/test-utils';

const originalWindow = window;

beforeAll(() => {
  saveProfile({
    id: '123',
    name: 'charles admin',
    email: 'charlesadmin@admin',
    root: true
  });

  Object.assign(window, originalWindow);
  const location = window.location;

  delete global.window.location;

  global.window.location = Object.assign({}, location);
})

test('render Token PlaceHolder', async () => {
  render(
    <MemoryRouter initialEntries={[routes.tokens]}>
      <Token />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.queryByText('TOKEN 1')).toBeInTheDocument());
  expect(screen.getByTestId('placeholder-empty-groups')).toBeInTheDocument();
});

test('render Token View mode', async () => {
  const tokenID = 'abd6efc4-3b98-4049-8bdb-e8919c3d09f4';

  window.location = {
    ...window.location,
    pathname: `${routes.tokensComparation}`,
    search: `?token=${tokenID}`
  };

  server.use(
    rest.post(`${DEFAULT_TEST_BASE_URL}/gate/api/v1/system-token/:token`, async (req, res, ctx) => {
      return res(ctx.json({
        "id":"abd6efc4-3b98-4049-8bdb-e8919c3d09f4",
        "name":"TOKEN 2",
        "permissions":[
          "maintenance_write",
          "deploy_write",
          "circles_read",
          "circles_write",
          "modules_read"
        ],
        "workspaces": "",
        "allWorkspaces": true,
        "revoked": false,
        "created_at": "2021-04-12T23:02:39.304307Z",
        "revoked_at": "",
        "last_used_at": "",
        "author":"charlesadmin@admin"
      }))
    }),
  );

  render(
    <MemoryRouter initialEntries={[`${routes.tokensComparation}?token=${tokenID}`]}>
      <Token />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('TOKEN 2')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('Created by charlesadmin@admin')).toBeInTheDocument());
  expect(screen.getByText('Your token has access to all workspaces (including new ones)')).toBeInTheDocument();

  const modules = screen.getByTestId('modules');
  const circles = screen.getByTestId('circles');
  const maintenance = screen.getByTestId('maintenance');
  const deploy = screen.getByTestId('deploy');

  expect(modules).toHaveTextContent('ModulesRead');
  expect(circles).toHaveTextContent('CirclesAll permissions');
  expect(deploy).toHaveTextContent('DeployAll permissions');
  expect(maintenance).toHaveTextContent('MaintenanceAll permissions');
});

test('should revoke token', async () => {
  const tokenID = 'abd6efc4-3b98-4049-8bdb-e8919c3d09f4';

  window.location = {
    ...window.location,
    pathname: `${routes.tokensComparation}`,
    search: `?token=${tokenID}`
  };

  server.use(
    rest.post(`${DEFAULT_TEST_BASE_URL}/gate/api/v1/system-token/:token`, async (req, res, ctx) => {
      return res(ctx.json({
        "id":"abd6efc4-3b98-4049-8bdb-e8919c3d09f4",
        "name":"TOKEN 2",
        "permissions":["maintenance_write"],
        "workspaces": "",
        "allWorkspaces": true,
        "revoked": false,
        "created_at": "2021-04-12T23:02:39.304307Z",
        "revoked_at": "",
        "last_used_at": "",
        "author":"charlesadmin@admin"
      }))
    }),
  );

  render(
    <MemoryRouter initialEntries={[`${routes.tokensComparation}?token=${tokenID}`]}>
      <Token />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('Created by charlesadmin@admin')).toBeInTheDocument());        
  const revokeToken = screen.getByText('Revoke token');
  userEvent.click(revokeToken);
  await waitFor(() => expect(screen.getByText('Are you sure you want to revoke this token?')));
  expect(screen.getByText('Yes, revoke token')).toBeInTheDocument();
});


test('should regenerate token', async () => {
  const tokenID = 'abd6efc4-3b98-4049-8bdb-e8919c3d09f4';

  window.location = {
    ...window.location,
    pathname: `${routes.tokensComparation}`,
    search: `?token=${tokenID}`
  };

  server.use(
    rest.post(`${DEFAULT_TEST_BASE_URL}/gate/api/v1/system-token/:token`, async (req, res, ctx) => {
      return res(ctx.json({
        "id":"abd6efc4-3b98-4049-8bdb-e8919c3d09f4",
        "name":"TOKEN 2",
        "permissions":["maintenance_write"],
        "workspaces": "",
        "allWorkspaces": true,
        "revoked": false,
        "created_at": "2021-04-12T23:02:39.304307Z",
        "revoked_at": "",
        "last_used_at": "",
        "author":"charlesadmin@admin"
      }))
    }),
  );

  render(
    <MemoryRouter initialEntries={[`${routes.tokensComparation}?token=${tokenID}`]}>
      <Token />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('Created by charlesadmin@admin')).toBeInTheDocument());        
  const regenerateToken= screen.getByText('Regenerate token');
  userEvent.click(regenerateToken);
  await waitFor(() => expect(screen.getByText('Are you sure you want to regenerate this token?')));
  const confirmRegenerate = screen.getByText('Yes, regenerate token');
  userEvent.click(confirmRegenerate);
  await waitFor(() => expect(screen.getByText('Your token has been regenerated!')));
});

test('should create a token', async () => {
  window.location = {
    ...window.location,
    pathname: `${routes.tokensComparation}`,
    search: `?token=${NEW_TAB}`
  };

  render(
    <MemoryRouter initialEntries={[`${routes.tokensComparation}?token=${NEW_TAB}`]}>
      <Token />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText('TOKEN 1')).toBeInTheDocument());        

  const name = screen.getByTestId('input-text-name');
  await act(() => userEvent.type(name, 'New Token')); 
  
  const addWorkspace = await screen.findByText('Add workspaces');
  userEvent.click(addWorkspace);

  await waitFor(() => expect(screen.getByText('Allow access for all workspaces')).toBeInTheDocument());
  const add = screen.getByText('Next');
  userEvent.click(add);

  await waitFor(() => expect(screen.getByText('Scopes')).toBeInTheDocument());
  const modules = screen.getByTestId('checkbox-toggle-Modules');
  userEvent.click(modules);

  const generateToken = screen.getByText('Generate token');
  await waitFor(() =>expect(generateToken).not.toBeDisabled());
  userEvent.click(generateToken);

  await waitFor(() => expect(screen.getByText('Your token has been created!')));
});