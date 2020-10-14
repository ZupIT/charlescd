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

import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { Datasource, Plugin, Response } from './interfaces';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { getAllDatasources, createDatasource as create, deleteDatasource, getAllPlugins } from 'core/providers/datasources';

export const useDatasource = (): FetchProps => {
  const dispatch = useDispatch();
  const [createData, createDatasource] = useFetch<Response>(create);
  const [datasourceData, getDatasources] = useFetch<Datasource[]>(
    getAllDatasources
  );
  const [delData, delDatasource] = useFetch(deleteDatasource);
  const {
    loading: loadingSave,
    response: responseSave,
    error: errorSave
  } = createData;
  const {
    loading: loadingAdd,
    response: responseAdd,
  } = delData;
  const { response, error } = datasourceData;
  const { response: responseRemove, error: errorRemove } = delData;

  const save = useCallback(
    (datasource: Datasource) => {
      createDatasource(datasource);
    },
    [createDatasource]
  );

  useEffect(() => {
    if (errorSave) {
      dispatch(
        toogleNotification({
          text: `[${errorSave.status}] Datasource could not be saved.`,
          status: 'error'
        })
      );
    }
  }, [errorSave, dispatch]);

  const getAll = useCallback(() => {
    getDatasources();
  }, [getDatasources]);

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `[${error.status}] Dat could not be fetched.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  const remove = useCallback((id: string) => {
    delDatasource(id);
  }, [delDatasource]);

  useEffect(() => {
    if (errorRemove) {
      dispatch(
        toogleNotification({
          text: `[${errorRemove.status}] Datasource could not be removed.`,
          status: 'error'
        })
      );
    }
  }, [errorRemove, dispatch]);

  return {
    getAll,
    save,
    remove,
    responseAll: response,
    responseAdd,
    responseRemove,
    loadingSave,
    responseSave,
    loadingAdd
  };
}

export const usePlugins = (): FetchProps => {
  const [allPlugins, getPlugins] = useFetch<
    Plugin[]
  >(getAllPlugins);

  const { response, loading } = allPlugins;

  const getAll = useCallback(() => {
    getPlugins()
  }, [getPlugins]);

  return {
    getAll,
    response,
    loading
  };
};


