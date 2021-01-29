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

import { FetchParams, useFetchData } from 'core/providers/base/hooks';
import { useCallback, useState } from 'react';

export type TestConnection = {
  status: 'error' | 'success' | 'idle';
  message?: string;
};

export const useTestConnection = (testConnection: FetchParams) => {
  const [response, setResponse] = useState<TestConnection>({ status: 'idle' });
  const [loading, setLoading] = useState(false);
  const testConnectionFetchData = useFetchData<number>(testConnection);

  const reset = () => {
    setResponse({
      message: null,
      status: 'idle'
    });
  };

  const save = useCallback(
    async (payload: unknown) => {
      try {
        setLoading(true);
        await testConnectionFetchData(payload);
        setResponse({
          status: 'success',
          message: 'Successful connection'
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        error?.text?.().then((errorMessage: string) => {
          const parsedError = JSON.parse(errorMessage);
          setResponse({
            status: 'error',
            message: parsedError?.message || 'error when trying to connect.'
          });
        });
      }
    },
    [testConnectionFetchData]
  );

  return {
    save,
    reset,
    response,
    loading
  };
};
