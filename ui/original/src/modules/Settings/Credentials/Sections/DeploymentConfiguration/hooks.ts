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
import { create, removeDeploymentConfiguration, configPath } from 'core/providers/deploymentConfiguration';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import {
  useFetchData,
  FetchStatuses
} from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { DeploymentConfiguration, Response } from './interfaces';

export const useCDConfiguration = (): FetchProps => {
  const dispatch = useDispatch();
  const [createData, createCDConfiguration] = useFetch<Response>(create);
  const [addData, addCDConfiguration] = useFetch(addConfig);
  const patchDeploymentConfig = useFetchData(delConfig);
  const removeDeploymentConfig = useFetchData(removeDeploymentConfiguration);
  const [status, setStatus] = useState<FetchStatuses>('idle');
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

  const save = useCallback(
    (cdConfiguration: DeploymentConfiguration) => {
      createCDConfiguration(cdConfiguration);
    },
    [createCDConfiguration]
  );

  useEffect(() => {
    if (responseSave) addCDConfiguration(configPath, responseSave?.id);
  }, [addCDConfiguration, responseSave]);

  useEffect(() => {
    if (errorSave) {
      dispatch(
        toogleNotification({
          text: `[${errorSave.status}] Deployment Configuration could not be saved.`,
          status: 'error'
        })
      );
    } else if (errorAdd) {
      dispatch(
        toogleNotification({
          text: `[${errorAdd.status}] Deployment Configuration could not be patched.`,
          status: 'error'
        })
      );
    }
  }, [errorSave, errorAdd, dispatch]);

  const remove = useCallback(async (id: string) => {
    try {
      setStatus('pending');
      await patchDeploymentConfig(configPath, id)
      removeDeploymentConfig(id); 
      dispatch(
        toogleNotification({
          text: 'Success deleting deployment configuration',
          status: 'success'
        })
      );
      setStatus('resolved');
    } catch (e) {
      setStatus('rejected');
      (async () => {
        if (e) {
          const error = await e.json();
          dispatch(
            toogleNotification({
              text: `${error.status}: ${error?.message}`,
              status: 'error'
            })
          );
        }
      })();
    }
  }, [patchDeploymentConfig, removeDeploymentConfig, dispatch]);

  return {
    responseAdd,
    save,
    remove,
    status,
    loadingSave,
    loadingAdd,
  };
};
