import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ReactComponent as Charles } from './svg/charles.svg';

const Questions = React.lazy(() => import('./Questions'));
const Identify = React.lazy(() => import('./Identify'));

function App() {
  return (
    <BrowserRouter>
      <Charles className="logo" />
      <Suspense fallback="">
        <Switch>
          <Route exact path="/" component={Identify} />
          <Route exact path="/questions" component={Questions} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
