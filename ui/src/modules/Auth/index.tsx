import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router';
import routes from 'core/constants/routes';
import { ReactComponent as AuthSVG } from 'core/assets/svg/circle-login.svg';
import Styled from './styled';

const Login = lazy(() => import('modules/Auth/Login'));

const Auth = () => {
  return (
    <Styled.Wrapper>
      <Styled.Container>
        <Styled.Background>
          <AuthSVG />
        </Styled.Background>
        <Styled.Content>
          <Suspense fallback="">
            <Switch>
              <Route path={routes.login} component={Login} />
            </Switch>
          </Suspense>
        </Styled.Content>
        <Styled.Copyright color="light">
          Developed with
          <Styled.Heart name="heart" size="12px" />
          by
          <Styled.Zup name="Zup" />
        </Styled.Copyright>
      </Styled.Container>
    </Styled.Wrapper>
  );
};

export default Auth;
