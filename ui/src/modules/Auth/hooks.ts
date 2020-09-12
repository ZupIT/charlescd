/* eslint-disable @typescript-eslint/camelcase */
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

import { useDispatch } from 'core/state/hooks';
import { useFetchStatus, FetchStatus } from 'core/providers/base/hooks';
import { useState } from 'react';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { logout } from 'core/utils/auth';
import { codeToTokens } from 'core/providers/auth';

type Grants = {
  [key in 'access_token' | 'refresh_token']: string;
};

export const useAuth = (): {
  getTokens: Function;
  grants: Grants;
  status: FetchStatus;
} => {
  const dispatch = useDispatch();
  const status = useFetchStatus();
  const [grants, setGrants] = useState(null);

  const getTokens = async (code: string) => {
    console.log('getTokens');
    try {
      if (code) {
        console.log('getTokens (code)', code);
        status.pending();
        const res = await codeToTokens(code);

        console.log('res', res);

        res({}).then((response: Response) => {
          if (response.ok) {
            response.json().then(json => {
              setGrants(json);
            });
          }
        });

        return res;
      }
    } catch (e) {
      const error = await e.json();

      if (error.error === 'invalid_token') {
        logout();
      } else {
        dispatch(
          toogleNotification({
            text: `${error.error} when trying to fetch`,
            status: 'error'
          })
        );
      }
    }
  };

  return {
    getTokens,
    grants,
    status
  };
};
