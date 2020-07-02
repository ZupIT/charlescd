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
import { configPath } from 'core/providers/circleMatcher';
import { addConfig, delConfig } from 'core/providers/workspace';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { useDispatch } from 'core/state/hooks';

export const useCircleMatcher = (): FetchProps => {
  const dispatch = useDispatch();
  const [addData, addCircleMatcher] = useFetch(addConfig);
  const [removeData, delCircleMatcher] = useFetch(delConfig);
  const { loading: loadingAdd, response: responseAdd, error } = addData;
  const { response: responseRemove, error: errorRemove } = removeData;

  const save = useCallback(
    (url: string) => {
      addCircleMatcher(configPath, url);
    },
    [addCircleMatcher]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `[${error.status}] Circle Matcher could not be saved.`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  const remove = useCallback(() => {
    delCircleMatcher(configPath);
  }, [delCircleMatcher]);

  useEffect(() => {
    if (errorRemove) {
      dispatch(
        toogleNotification({
          text: `[${errorRemove.status}] Circle Matcher could not be removed.`,
          status: 'error'
        })
      );
    }
  }, [errorRemove, dispatch]);

  return { responseAdd, responseRemove, loadingAdd, save, remove };
};
