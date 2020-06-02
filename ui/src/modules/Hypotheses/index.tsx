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

import React, { lazy, useEffect, useState } from 'react';
import { Route, matchPath, useLocation } from 'react-router-dom';
import find from 'lodash/find';
import Page from 'core/components/Page';
import Placeholder from 'core/components/Placeholder';
import routes from 'core/constants/routes';
import { getProfileByKey } from 'core/utils/profile';
import { useGlobalState } from 'core/state/hooks';
import Menu from './Menu';
import { useHypothesis } from './hooks';
import { Hypothesis } from './interfaces';
import Styled from './styled';

const Board = lazy(() => import('modules/Hypotheses/Board'));

const Hypotheses = () => {
  const location = useLocation();
  const { getAll, loadingAll } = useHypothesis();
  const [hypothesis, setHypothesis] = useState<Hypothesis>();
  const { hypotheses } = useGlobalState(state => state.hypothesis);
  const profileName = getProfileByKey('name');
  const [, setName] = useState('');

  // TODO_BOARD: Filtro

  useEffect(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    const matched = matchPath<{ hypothesisId: string }>(location.pathname, {
      path: routes.hypothesesEdit
    });

    if (matched?.params) {
      const { hypothesisId } = matched.params;
      setHypothesis(find(hypotheses, ['id', hypothesisId]));
    }
  }, [hypotheses, location]);

  return (
    <Page>
      <Page.Menu>
        <Menu
          isLoading={loadingAll}
          items={hypotheses}
          onSearch={setName}
          onSelect={setHypothesis}
        />
      </Page.Menu>
      {hypothesis ? (
        <Route exact path={routes.hypothesesEdit}>
          <Styled.ScrollableX>
            <Board id={hypothesis.id} name={hypothesis.name} />

            {/* <Moove id={hypothesis.id} name={hypothesis.name} /> */}
          </Styled.ScrollableX>
        </Route>
      ) : (
        <Placeholder
          icon="empty-hypothesis"
          title={`Welcome, ${profileName}!`}
          subtitle="Select a hypothesis and keep evolving."
        />
      )}
    </Page>
  );
};

export default Hypotheses;
