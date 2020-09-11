import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route } from 'react-router';
import routes from 'core/constants/routes';
import { ReactComponent as AuthSVG } from 'core/assets/svg/circle-login.svg';
import { loginIDM } from 'core/utils/auth';
import Styled from './styled';

const Login = lazy(() => import('modules/Auth/Login'));

const Auth = () => {
  useEffect(() => {
    const isIdm = window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM;
    console.log('isIdm', isIdm);

    if (parseInt(isIdm)) {
      console.log('loginIDM');
      loginIDM();
    }
  });

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
