import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Page from 'core/components/Page';
import routes from 'core/constants/routes';
import { useGlobalState } from 'core/state/hooks';
import Menu from './Menu';
import useUser from './hooks';

const UserList = lazy(() => import('./UserList'));

const User = () => {
  const [filerUser] = useUser();
  const [name, setName] = useState('');
  const { list } = useGlobalState(({ users }) => users);

  useEffect(() => {
    filerUser(name);
  }, [name, filerUser]);

  return (
    <Page>
      <Page.Menu>
        <Menu items={list?.content} onSearch={setName} />
      </Page.Menu>
      <Page.Content>
        <Suspense fallback="">
          <Route path={routes.main} component={UserList} />
        </Suspense>
      </Page.Content>
    </Page>
  );
};

export default User;
