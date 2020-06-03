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
import { useFetch } from 'core/providers/base/hooks';
import { circleMatcherIdentify } from 'core/providers/circle';
import { ParameterPayload, CircleMatcherResult } from './interfaces';
import { useDispatch } from 'core/state/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';

const useCircleMatcher = (): [CircleMatcherResult[], boolean, Function] => {
  const dispatch = useDispatch();
  const [circles, getCircleMatcherCircles] = useFetch<CircleMatcherResult[]>(
    circleMatcherIdentify
  );
  const { response, loading, error } = circles;

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `Error performing circle matcher try out`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  const identifyCircles = useCallback(
    (data: ParameterPayload) => {
      getCircleMatcherCircles(data);
    },
    [getCircleMatcherCircles]
  );

  return [response, loading, identifyCircles];
};

export default useCircleMatcher;
