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

import { useCallback, useEffect } from 'react';
import { create, configPath } from 'core/providers/registry';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
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

  return { responseAdd, save, responseRemove, remove, loadingSave, loadingAdd };
};
