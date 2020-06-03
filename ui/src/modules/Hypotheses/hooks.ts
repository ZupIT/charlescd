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
import { findAll, createHypothesis } from 'core/providers/hypothesis';
import { useFetch, FetchProps } from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { loadedHypotheses } from 'modules/Hypotheses/state/actions';
import { Hypothesis } from './interfaces';

export const useHypothesis = (): FetchProps => {
  const [hypotheses, getHypotheses] = useFetch<{ content: Hypothesis[] }>(
    findAll
  );
  const { response, loading: loadingAll } = hypotheses;
  const dispatch = useDispatch();

  const getAll = useCallback(() => {
    getHypotheses();
  }, [getHypotheses]);

  useEffect(() => {
    if (response) {
      dispatch(loadedHypotheses(response.content));
    }
  }, [response, dispatch]);

  return {
    getAll,
    loadingAll,
    responseAll: response?.content
  };
};

interface CreateHypothesis extends FetchProps {
  create: Function;
  response: Hypothesis;
}

export const useCreateHypothesis = (): CreateHypothesis => {
  const [newHypothesis, createHypothesisRequest] = useFetch<Hypothesis>(
    createHypothesis
  );
  const { response, loading } = newHypothesis;
  const { getAll } = useHypothesis();

  const create = useCallback(
    (payload: Hypothesis) => {
      createHypothesisRequest(payload);
    },
    [createHypothesisRequest]
  );

  useEffect(() => {
    if (response) {
      getAll();
    }
  }, [response, getAll]);

  return {
    create,
    response,
    loading
  };
};
