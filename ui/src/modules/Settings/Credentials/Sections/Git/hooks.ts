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
import { create, configPath } from 'core/providers/git';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { Git, Response } from './interfaces';

export const useGit = (): FetchProps => {
  const [createData, createGit] = useFetch<Response>(create);
  const [addData, addGit] = useFetch(addConfig);
  const [delData, delGit] = useFetch(delConfig);
  const { loading: loadingSave, response: responseSave } = createData;
  const { loading: loadingAdd, response: responseAdd } = addData;
  const { loading: loadingRemove, response: responseRemove } = delData;

  const save = useCallback(
    (git: Git) => {
      createGit(git);
    },
    [createGit]
  );

  useEffect(() => {
    if (responseSave) addGit(configPath, responseSave?.id);
  }, [addGit, responseSave]);

  const remove = useCallback(() => {
    delGit(configPath);
  }, [delGit]);

  return {
    responseAdd,
    save,
    responseRemove,
    remove,
    loadingSave,
    loadingAdd,
    loadingRemove
  };
};
