import React, { lazy, useState } from 'react';
import isUndefined from 'lodash/isUndefined';
import { Route, Redirect, Switch } from 'react-router-dom';
import Sidebar from 'modules/Main/Sidebar';
import Footer from 'modules/Main/Footer';
import { setExpandMode, getExpandMode } from 'core/utils/sidebar';
import routes from 'core/constants/routes';
import { ExpandClick } from './Sidebar/Types';
import Styled from './styled';

const Circles = lazy(() => import('modules/Circles'));
const Hypotheses = lazy(() => import('modules/Hypotheses'));
const Workspaces = lazy(() => import('modules/Settings/Workspaces'));
const Users = lazy(() => import('modules/Users'));

const Main = () => {
  const [isExpanded, setSideExpanded] = useState(getExpandMode());

  const onClickExpand = ({ status, persist }: ExpandClick) => {
    const newStatus = isUndefined(status) ? !isExpanded : status;
    setSideExpanded(newStatus);
    if (persist) {
      setExpandMode(newStatus);
    }
  };

  return (
    <Styled.Main isSidebarExpanded={isExpanded}>
      <Sidebar isExpanded={isExpanded} onClickExpand={onClickExpand} />
      <Styled.Content data-testid="main-content">
        <React.Suspense fallback="">
          <Switch>
            <Route path={routes.circles} component={Circles} />
            <Route path={routes.hypotheses} component={Hypotheses} />
            <Route path={routes.workspace} component={Workspaces} />
            <Route path={routes.users} component={Users} />
            <Redirect exact from={routes.main} to={routes.circles} />
          </Switch>
        </React.Suspense>
      </Styled.Content>
      <Footer />
    </Styled.Main>
  );
};

export default Main;
