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

import { useCallback, useEffect, useState } from 'react';
import {
  create,
  configPath,
  validation,
  validationConnection
} from 'core/providers/registry';
import { addConfig, delConfig } from 'core/providers/workspace';
import {
  useFetch,
  FetchProps,
  ResponseError,
  useFetchData,
  useFetchStatus,
  FetchStatus
} from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Registry, Response } from './interfaces';

export const useRegistry = (): FetchProps => {
  const dispatch = useDispatch();
  const [createData, createRegistry] = useFetch<Response>(create);
  const [addData, addRegistry] = useFetch(addConfig);
  const [delData, delRegistry] = useFetch(delConfig);
  const {
    loading: loadingSave,
    response: responseSave,
    error: errorSave
  } = createData;
  const {
    loading: loadingAdd,
    response: responseAdd,
    error: errorAdd
  } = addData;
  const { response: responseRemove, error: errorRemove } = delData;

  const save = useCallback(
    (registry: Registry) => {
      createRegistry(registry);
    },
    [createRegistry]
  );

  useEffect(() => {
    if (responseSave) addRegistry(configPath, responseSave?.id);
  }, [addRegistry, responseSave]);

  useEffect(() => {
    if (errorSave) {
      dispatch(
        toogleNotification({
          text: `[${errorSave.status}] Registry could not be saved.`,
          status: 'error'
        })
      );
    } else if (errorAdd) {
      dispatch(
        toogleNotification({
          text: `[${errorAdd.status}] Registry could not be patched.`,
          status: 'error'
        })
      );
    }
  }, [errorSave, errorAdd, dispatch]);

  const remove = useCallback(() => {
    delRegistry(configPath);
  }, [delRegistry]);

  useEffect(() => {
    if (errorRemove) {
      dispatch(
        toogleNotification({
          text: `[${errorRemove.status}] Registry could not be removed.`,
          status: 'error'
        })
      );
    }
  }, [errorRemove, dispatch]);

  return {
    responseAdd,
    save,
    responseRemove,
    remove,
    loadingSave,
    loadingAdd
  };
};

export const useRegistryTest = (): {
  testConnection: Function;
  response: Response;
  error: ResponseError;
  status: FetchStatus;
} => {
  const status = useFetchStatus();
  const test = useFetchData<Response>(validation);
  const [response, setResponse] = useState<Response>(null);
  const [error, setError] = useState<ResponseError>(null);

  const testConnection = useCallback(
    async (registry: Registry) => {
      try {
        if (registry) {
          status.pending();
          const res = await test(registry);

          setResponse(res);
          status.resolved();

          return res;
        }
      } catch (e) {
        status.rejected();
        const err = await e.json();

        setResponse(null);
        setError(err);
      }
    },
    [test, status]
  );

  return {
    testConnection,
    response,
    error,
    status
  };
};

export const useRegistryConnection = (): {
  testConnection: Function;
  response: Response;
  error: ResponseError;
} => {
  const test = useFetchData<Response>(validationConnection);
  const [response, setResponse] = useState<Response>(null);
  const [error, setError] = useState<ResponseError>(null);

  const testConnection = useCallback(
    async (configurationId: string) => {
      try {
        if (configurationId) {
          const res = await test(configurationId);

          setResponse(res);

          return res;
        }
      } catch (e) {
        const err = await e.json();

        setResponse(null);
        setError(err);
      }
    },
    [test]
  );

  return {
    testConnection,
    response,
    error
  };
};
