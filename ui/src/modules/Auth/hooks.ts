import { useDispatch } from 'core/state/hooks';
import {
  useFetchData,
  useFetchStatus,
  FetchStatus
} from 'core/providers/base/hooks';
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
  // const getTokensByCode = useFetchData<unknown>(codeToTokens);
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

        status.resolved();

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

      status.rejected();
    }
  };

  return {
    getTokens,
    grants,
    status
  };
};
