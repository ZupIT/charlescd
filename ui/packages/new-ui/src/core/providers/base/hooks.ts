import { useEffect, useState, useCallback, useRef } from 'react';
import { HTTP_STATUS } from 'core/enums/HttpStatus';
import { renewToken } from '../auth';
import { getRefreshToken } from 'core/utils/auth';
import { redirectToLegacy } from 'core/utils/routes';
import routes from 'core/constants/routes';

interface FetchData<T> {
  response: T;
  error: Response;
  loading: boolean;
}

const renewTokenByCb = (fn: () => Promise<Response>) =>
  fn().catch(async (error: Response) => {
    if (HTTP_STATUS.unauthorized === error.status) {
      try {
        await renewToken(getRefreshToken())({});
        return fn();
      } catch (error) {
        redirectToLegacy(routes.login);
        return error;
      }
    } else {
      return Promise.reject(error);
    }
  });

export const useFetch = <T>(
  req: (...args: unknown[]) => (options: RequestInit) => Promise<Response>
): [FetchData<T>, (...args: unknown[]) => void] => {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<Response>(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  const trigger = useCallback(
    async (...args: unknown[]) => {
      setLoading(true);
      try {
        const response = await renewTokenByCb(() => req(...args)({}));
        const data = await response.json();

        if (mounted.current) setResponse(data);
      } catch (error) {
        if (mounted.current) setError(error);
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [req, mounted]
  );

  useEffect(() => {
    return () => (mounted.current = false);
  }, []);

  return [{ response, error, loading }, trigger];
};
