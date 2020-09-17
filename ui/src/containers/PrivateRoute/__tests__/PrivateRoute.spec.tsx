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
import { render, wait, screen } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import PrivateRoute from '../index';
import { MemoryRouter } from 'react-router-dom';
import { setAccessToken } from 'core/utils/auth';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import * as workspaceUtils from 'core/utils/workspace';

const MockApp = () => <span data-testid="mock-component">mock app</span>;

beforeEach(() => {
  setAccessToken(
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUWVhieWtWSDNQLXhDMU5iTTZsQ2NJQ1BDbE54S0FMREZ4ZWNUcWZsNlFzIn0.eyJleHAiOjE1ODkzMjg2NDEsImlhdCI6MTU4OTMyNTA0MSwianRpIjoiZWMwYzZmODMtNzJlOC00YjAxLWE1NjctZTk2Mjg3Y2FlYzdkIiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLWtleWNsb2FrLmNvbnRpbnVvdXNwbGF0Zm9ybS5jb20vYXV0aC9yZWFsbXMvZGFyd2luIiwiYXVkIjpbImRhcndpbi1jbGllbnQiLCJhY2NvdW50Il0sInN1YiI6IjJlNjIzYzE2LTNlMDctNDA4Yi04ODcwLTQ4YjkxZDZmZDY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRhcndpbi1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiZjU4ZGEwNzQtOGY1ZC00OGNiLTliYzktODM0MmNlMDBmZDcwIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJtb292ZV9yZWFkIiwiY29uZmlnX3dyaXRlIiwiYWRtaW4iLCJjaXJjbGVfcmVhZCIsImNpcmNsZV93cml0ZSIsIm1vZHVsZV9yZWFkIiwiYnVpbGRfcmVhZCIsImRlcGxveV9yZWFkIiwiZGVwbG95X3dyaXRlIiwiYnVpbGRfd3JpdGUiLCJvZmZsaW5lX2FjY2VzcyIsImNvbmZpZ19yZWFkIiwibW9kdWxlX3dyaXRlIiwidW1hX2F1dGhvcml6YXRpb24iLCJtb292ZV93cml0ZSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc1Jvb3QiOnRydWUsIm5hbWUiOiJkYXJ3aW5hZG1pbiIsIndvcmtzcGFjZXMiOlt7ImlkIjoiOTI1MDdlYWYtOThjMS00OGViLTkzMGYtZWI2Y2YzZjA0MTMwIiwicGVybWlzc2lvbnMiOlsibWFpbnRlbmFuY2Vfd3JpdGUiLCJkZXBsb3lfd3JpdGUiLCJjaXJjbGVzX3JlYWQiLCJjaXJjbGVzX3dyaXRlIiwibW9kdWxlc19yZWFkIiwibW9kdWxlc193cml0ZSJdfSx7ImlkIjoiZTZmZWEzZDAtYjVjYi00OTIwLThjNjctZDNjNjc4MDEyZjRiIiwicGVybWlzc2lvbnMiOlsibWFpbnRlbmFuY2Vfd3JpdGUiLCJjaXJjbGVzX3dyaXRlIiwibW9kdWxlc193cml0ZSIsImh5cG90aGVzaXNfcmVhZCJdfSx7ImlkIjoiMGJjOTg2NTMtOTRkYy00OTRhLWJkZmYtOWQxN2Q0MTI3Yzg2IiwicGVybWlzc2lvbnMiOlsiaHlwb3RoZXNpc193cml0ZSIsIm1vZHVsZXNfcmVhZCIsIm1vZHVsZXNfd3JpdGUiLCJjaXJjbGVzX3JlYWQiLCJoeXBvdGhlc2lzX3JlYWQiLCJjaXJjbGVzX3dyaXRlIiwiZGVwbG95X3dyaXRlIl19XSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZGFyd2luYWRtaW5AenVwLmNvbS5iciIsImdpdmVuX25hbWUiOiJkYXJ3aW5hZG1pbiIsImVtYWlsIjoiZGFyd2luYWRtaW5AenVwLmNvbS5iciJ9.FAAdXjA7T2zIcpxEIMe_Xk24DO415zmKqSWDLh4trJpj_b6ZtL1BBYId1d6fggylPUYhEqVWTrfEfMlc7p1KwWqgTSl5YzdOvi0OSuLkh9yHbLK2G26I5pIDmKWEBf7IaaWb0J2D_f-qKjQ9Mq9p9XrXlnGPPnk32EMtti4zt9SYvgBeGwR0g-6CVKiO_YNgCK8xAaaq7TRJfOb4nxpaPswNpUtG4A4BihiJcg0DsriqMOGSy2HmYPWSUW0kSi2DTGqLIuFyTrO7APZwBzsiSI0ObHzw9h8gbNK5PIYhXUtxnY-razcU7wtZgxWj0s08Q1cNZk8dwlEd1v6_b6Csvg'
  );
});

test('render Private Route allowed', async () => {
  const workspaceID = '1234-workspace';
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue(workspaceID);
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.COMPLETE
      },
      status: 'resolved'
    });
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/main']}>
      <PrivateRoute
        path="/main"
        component={MockApp}
        allowedRoles={['moove_write']}
        allowedRoute
      />
    </MemoryRouter>
  );

  await wait(() => expect(getByTestId('mock-component')).toBeInTheDocument());
});

test('render Private Route not allowed', async () => {
  setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc1Jvb3QiOmZhbHNlfQ.sEZZKPx1eyELnP_aI3Ethc5O9iwLRKAW6lZdXUtv_Jg');
  const workspaceID = '1234-workspace';
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue(workspaceID);
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.INCOMPLETE
      },
      status: 'resolved'
    });
  const { queryByTestId } = render(
    <MemoryRouter initialEntries={['/main']}>
      <PrivateRoute
        path="/main"
        component={MockApp}
        allowedRoles={['moove_write']}
        allowedRoute={false}
      />
    </MemoryRouter>
  );

  const body = queryByTestId('mock-component');
  await wait(() => expect(body).not.toBeInTheDocument());
});

test('render PrivateRoute without role', async () => {
  setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc1Jvb3QiOmZhbHNlfQ.sEZZKPx1eyELnP_aI3Ethc5O9iwLRKAW6lZdXUtv_Jg');
  const workspaceID = '1234-workspace';
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.INCOMPLETE
      },
      status: 'resolved'
    });
  const { queryByTestId } = render(
    <MemoryRouter initialEntries={['/main']}>
      <PrivateRoute path="/main" component={MockApp} allowedRoles={['role']} />
    </MemoryRouter>
  );

  await wait(() =>
    expect(queryByTestId('mock-component')).not.toBeInTheDocument()
  );
});

test('render PrivateRoute by refresh', async () => {
  const workspaceID = '1234-workspace';
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue(workspaceID);
  (fetch as FetchMock).mockRejectedValue(JSON.stringify({ name: 'login' }));
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.COMPLETE
      },
      status: 'idle'
    })
    .mockReturnValue({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.COMPLETE
      },
      status: 'rejected'
    });

  render(
    <MemoryRouter initialEntries={['/main']}>
      <PrivateRoute
        path="/main"
        component={MockApp}
        allowedRoles={['moove_write']}
      />
    </MemoryRouter>
  );

  await wait(() => 
    expect(screen.queryByTestId('mock-component')).toBeInTheDocument()
  );
});
