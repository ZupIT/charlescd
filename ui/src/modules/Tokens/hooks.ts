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

import { useCallback, useState } from 'react';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { findAll, findById, revoke, regenerate, create } from 'core/providers/tokens';
import { TokenPagination } from './interfaces/TokenPagination';
import { Token, TokenCreate } from './interfaces';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';
import { clearTokens, loadedTokens } from './state/actions';

export const useFindAll = (): {
  getTokens: Function,
  resetTokens: Function,
  status: FetchStatuses,
} => {
  const getAll = useFetchData<TokenPagination>(findAll);
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const dispatch = useDispatch();
  const resetTokens = useCallback(() => dispatch(clearTokens()), [dispatch]);

  const getTokens = useCallback(
    async (name: string, page: string) => {
      try {
        setStatus('pending');
        resetTokens();
        const res = await getAll({ name, page });
        dispatch(loadedTokens(res));
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
      }
    }, [getAll, resetTokens, dispatch]);

  return {
    getTokens,
    resetTokens,
    status
  }
};

export const useFind = () => {
  const fetchData = useFetchData<Token>(findById);
  const [response, setResponse] = useState<Token>();
  const [status, setStatus] = useState<FetchStatuses>('idle');

  const getById = useCallback(async (id: string) => {
    try {
      setStatus('pending');
      const data = await fetchData(id);
      setStatus('resolved');
      setResponse(data);

      return data;
    } catch (e) {
      setStatus('rejected');
    }
  }, [fetchData]);

  return {
    getById,
    response,
    status
  };
};

export const useRevoke = () => {
  const fetchData = useFetchData<Token>(revoke);
  const [response, setResponse] = useState<Token>();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const { getTokens } = useFindAll();

  const revokeById = useCallback(async (id: string) => {
    try {
      setStatus('pending');
      const data = await fetchData(id);
      await getTokens();
      setStatus('resolved');
      setResponse(data);

      return data;
    } catch (e) {
      setStatus('rejected');
    }
  }, [fetchData, getTokens]);

  return {
    revokeById,
    response,
    status
  };
};

type TokenRegenerated = { token: string };

export const useRegenerate = () => {
  const fetchData = useFetchData<TokenRegenerated>(regenerate);
  const [response, setResponse] = useState<TokenRegenerated>();
  const [status, setStatus] = useState<FetchStatuses>('idle');

  const regenerateById = useCallback(async (id: string) => {
    try {
      setStatus('pending');
      const data = await fetchData(id);
      setStatus('resolved');
      setResponse(data);

      return data;
    } catch (e) {
      setStatus('rejected');
    }
  }, [fetchData]);

  return {
    regenerateById,
    response,
    status
  };
};

export const useSave = () => {
  const saveToken = useFetchData<Token>(create);
  const [response, setResponse] = useState<Token>();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const { getTokens } = useFindAll();
  const dispatch = useDispatch();

  const save = useCallback(async (token: TokenCreate) => {
    try {
      setStatus('pending');
      const data = await saveToken(token);
      await getTokens();
      setStatus('resolved');
      setResponse(data);

      return data;
    } catch (error) {
      const e = await error.json();
      dispatch(
        toogleNotification({
          text: e?.message,
          status: 'error'
        })
      );
      setStatus('rejected');
    }
  }, [saveToken, dispatch, getTokens]);

  return {
    save,
    response,
    status
  };
};
