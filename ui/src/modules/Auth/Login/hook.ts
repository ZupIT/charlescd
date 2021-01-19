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

import { useState, useEffect, useCallback } from 'react';
import { useFetch, useFetchData } from 'core/providers/base/hooks';
import { login, circleMatcher } from 'core/providers/auth';
import { saveSessionData } from 'core/utils/auth';
import { saveCircleId } from 'core/utils/circle';
import { useUser, useWorkspacesByUser } from 'modules/Users/hooks';
import { saveProfile } from 'core/utils/profile';
import { useWorkspaces } from 'modules/Settings/hooks';

interface CircleMatcherResponse {
  circles: {
    id: string;
  }[];
}

export const useCircleMatcher = (): {
  getCircleId: Function;
} => {
  const getCircleMatcher = useFetchData<CircleMatcherResponse>(circleMatcher);

  const getCircleId = useCallback(
    async (data: unknown) => {
      try {
        const response = await getCircleMatcher(data);
        if (response) {
          const [circle] = response?.circles;
          saveCircleId(circle?.id);
        }
      } catch (e) {
        console.info('No circle was detected for this user');
      }
    },
    [getCircleMatcher]
  );

  return {
    getCircleId
  };
};

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const useLogin = (): {
  doLogin: Function;
  status: string;
  error: string;
} => {
  const [, , getSession] = useFetch<AuthResponse>(login);
  const { getCircleId } = useCircleMatcher();
  const { findByEmail, user } = useUser();
  const { findWorkspacesByUser, workspaces } = useWorkspacesByUser();
  const [, loadWorkspaces, loadWorkspacesResponse] = useWorkspaces();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (workspaces) {
      saveProfile({ ...user, workspaces });

      setStatus('resolved');
    }
  }, [user, workspaces]);

  useEffect(() => {
    if (loadWorkspacesResponse) {
      saveProfile({ ...user, workspaces: loadWorkspacesResponse?.content });

      setStatus('resolved');
    }
  }, [user, loadWorkspacesResponse]);

  const doLogin = useCallback(
    async (email: string, password: string) => {
      setStatus('pending');
      setError('');
      try {
        const response: AuthResponse = await getSession(email, password);
        saveSessionData(response['access_token'], response['refresh_token']);
        await getCircleId({ username: email });
        const { id, root } = await findByEmail(email);
        if (root) {
          await loadWorkspaces();
        } else {
          await findWorkspacesByUser(id);
        }
      } catch (e) {
        const errorMessage = e.message || `${e.status}: ${e.statusText}`;
        setError(errorMessage);
        setStatus('rejected');
      }
    },
    [getSession, getCircleId, findByEmail, findWorkspacesByUser, loadWorkspaces]
  );

  return {
    doLogin,
    status,
    error
  };
};
