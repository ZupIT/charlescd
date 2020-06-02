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

import { useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { findAll } from 'core/providers/modules';
import { Module } from 'modules/Modules/interfaces/Module';
import { toogleNotification } from 'core/components/Notification/state/actions';

interface Modules {
  content: Module[];
}

export const useModules = (): {
  getAllModules: Function;
  allModules: Module[];
  loading: boolean;
} => {
  const dispatch = useDispatch();
  const [modulesData, getModules] = useFetch<Modules>(findAll);
  const { response, loading, error } = modulesData;

  const getAllModules = useCallback(
    (name: string) => {
      getModules(name);
    },
    [getModules]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `The modules could not be fetched.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  return {
    getAllModules,
    allModules: response?.content,
    loading
  };
};
