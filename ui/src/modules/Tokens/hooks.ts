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
import { useFetchData, useFetchStatus } from 'core/providers/base/hooks';
import { findAll, findById, remove } from 'core/providers/tokens';
import { Pagination } from 'core/interfaces/Pagination';
import { Token } from './interfaces';
import { mockTokens, mockToken } from './fixtures';

export const useFindAll = () => {
  // const fetchData = useFetchData<Token[]>(findAll);
  const [response, setResponse] = useState<Pagination<Token>>();
  const status = useFetchStatus();

  const getAll = useCallback(async (name: string, page: number) => {
    try {
      status.pending();

      // const data = await fetchData();

      setResponse(mockTokens);

      status.resolved();

      return mockTokens;
    } catch (e) {
      status.rejected();
    }
  }, [status]);

  return {
    getAll,
    response,
    status
  };
};

export const useFind = () => {
  // const fetchData = useFetchData<Token>(findById);
  const [response, setResponse] = useState<Token>();
  const status = useFetchStatus();

  const getById = useCallback(async (id: string) => {
    try {
      status.pending();

      // const data = await fetchData(id);

      setResponse(mockToken);

      status.resolved();

      return mockToken;
    } catch (e) {
      status.rejected();
    }
  }, [status]);

  return {
    getById,
    response,
    status
  };
};

export const useRemove = () => {
  // const fetchData = useFetchData<Token[]>(remove);
  const status = useFetchStatus();

  const removeById = useCallback(async (id: string) => {
    try {
      status.pending();

      // const data = await fetchData(id);

      status.resolved();

      return mockTokens;
    } catch (e) {
      status.rejected();
    }
  }, [status]);

  return {
    removeById,
    status
  };
};

export const useSave = () => {
  // const fetchData = useFetchData<Token[]>(remove);
  const status = useFetchStatus();

  const save = useCallback(async (token: Token) => {
    try {
      status.pending();

      // const data = await fetchData(token);

      status.resolved();

      return mockTokens;
    } catch (e) {
      status.rejected();
    }
  }, [status]);

  return {
    save,
    status
  };
};
