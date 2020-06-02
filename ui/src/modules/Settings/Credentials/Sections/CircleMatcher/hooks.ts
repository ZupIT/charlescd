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

import { useCallback } from 'react';
import { configPath } from 'core/providers/circleMatcher';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';

export const useCircleMatcher = (): FetchProps => {
  const [addData, addCircleMatcher] = useFetch(addConfig);
  const [, delCircleMatcher] = useFetch(delConfig);
  const { loading: loadingAdd, response: responseAdd } = addData;

  const save = useCallback(
    (url: string) => {
      addCircleMatcher(configPath, url);
    },
    [addCircleMatcher]
  );

  const remove = useCallback(() => {
    delCircleMatcher(configPath);
  }, [delCircleMatcher]);

  return { responseAdd, loadingAdd, save, remove };
};
