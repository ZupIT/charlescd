import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import useCircles, { CIRCLE_TYPES, CIRCLE_STATUS } from './hooks';
import { useGlobalState } from 'core/state/hooks';
import Filter from './Filter';
import Styled from './styled';

const CirclesList = lazy(() => import('modules/Circles/List'));
const CirclesComparation = lazy(() => import('modules/Circles/Comparation'));

const Circles = () => {
  const [loading, filterCircles] = useCircles(CIRCLE_TYPES.list);
  const { list } = useGlobalState(({ circles }) => circles);
  const [status, setStatus] = useState<string>(CIRCLE_STATUS.active);
  const [name, setName] = useState('');

  useEffect(() => {
    filterCircles(name, status);
  }, [status, name, filterCircles]);

  return (
    <Page>
      <Page.Menu>
        <Filter
          isLoading={loading}
          items={list?.content}
          status={status}
          onSearch={setName}
          onSelect={setStatus}
        />
      </Page.Menu>
      <Suspense fallback="">
        <Switch>
          <Route exact path={routes.circles}>
            <Styled.Scrollable>
              <CirclesList />
            </Styled.Scrollable>
          </Route>
          <Route exact path={routes.circlesComparation}>
            <Styled.ScrollableX>
              <CirclesComparation />
            </Styled.ScrollableX>
          </Route>
        </Switch>
      </Suspense>
    </Page>
  );
};

export default Circles;
