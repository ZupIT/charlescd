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
import { useState, useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import {
  createComponent,
  updateComponent,
  deleteComponent
} from 'core/providers/modules';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Module } from 'modules/Modules/interfaces/Module';

export const useSaveComponent = (): {
  saveComponent: Function;
  response: Module;
  error: Response;
  loading: boolean;
} => {
  const [data, saveComponent] = useFetch<Module>(createComponent);
  const { response, loading, error } = data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `${error.status}: ${error.statusText}`,
          status: 'error'
        })
      );
    }
  }, [dispatch, error]);

  return {
    saveComponent,
    response,
    error,
    loading
  };
};

export const useUpdateComponent = (): {
  updateComponent: Function;
  response: Module;
  error: Response;
  loading: boolean;
} => {
  const [data, update] = useFetch<Module>(updateComponent);
  const { response, loading, error } = data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `${error.status}: ${error.statusText}`,
          status: 'error'
        })
      );
    }
  }, [dispatch, error]);

  return {
    updateComponent: update,
    response,
    error,
    loading
  };
};

export const useDeleteComponent = (): {
  removeComponent: Function;
  status: string;
  error: Response;
  loading: boolean;
} => {
  const [data, , deletePromise] = useFetch<Module>(deleteComponent);
  const [status, setStatus] = useState('');
  const { loading, error } = data;
  const dispatch = useDispatch();

  const removeComponent = useCallback(
    (moduleId: string, componentId: string) => {
      setStatus('');
      deletePromise(moduleId, componentId).then(() => setStatus('resolved'));
    },
    [deletePromise]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `${error.status}: ${error.statusText}`,
          status: 'error'
        })
      );
    }
  }, [dispatch, error]);

  return {
    removeComponent,
    status,
    error,
    loading
  };
};
