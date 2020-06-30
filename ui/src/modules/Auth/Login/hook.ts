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
import { useFetch } from 'core/providers/base/hooks';
import { login, circleMatcher } from 'core/providers/auth';
import { saveSessionData } from 'core/utils/auth';
import { saveCircleId } from 'core/utils/circle';
import { CIRCLE_UNMATCHED } from './constants';
import { useUser } from 'modules/Users/hooks';
import { saveProfile } from 'core/utils/profile';

interface CircleMatcherResponse {
  circles: {
    id: string;
  }[];
}

export const useCircleMatcher = (): {
  getCircleId: Function;
  loading: boolean;
} => {
  const [data, getCircleMatcher] = useFetch<CircleMatcherResponse>(
    circleMatcher
  );
  const { loading, response, error } = data;

  useEffect(() => {
    if (response) {
      const [circle] = response?.circles;
      saveCircleId(circle?.id);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      saveCircleId(CIRCLE_UNMATCHED);
    }
  }, [error]);

  const getCircleId = useCallback(
    (data: unknown) => {
      getCircleMatcher(data);
    },
    [getCircleMatcher]
  );

  return {
    getCircleId,
    loading
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
  const [profile, , getUserByEmail] = useUser();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      const profileBase64 = btoa(JSON.stringify(profile));
      saveProfile(profileBase64);
      setStatus('resolved');
    }
  }, [profile]);

  const doLogin = useCallback(
    async (email: string, password: string) => {
      setStatus('pending');
      setError('');
      try {
        const response: AuthResponse = await getSession(email, password);
        getCircleId({ username: email });
        getUserByEmail(email);
        saveSessionData(response['access_token'], response['refresh_token']);
      } catch (e) {
        const errorMessage = e.message || `${e.status}: ${e.statusText}`;
        setError(errorMessage);
        setStatus('rejected');
      }
    },
    [getSession, getCircleId, getUserByEmail]
  );

  return {
    doLogin,
    status,
    error
  };
};
