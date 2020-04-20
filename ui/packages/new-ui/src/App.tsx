import React, { useReducer } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'core/assets/style/global';
import THEME from 'core/assets/themes';
import { Provider as ContextProvider } from 'core/state/store';
import { rootState, rootReducer } from 'core/state';
import Routes from './Routes';

const currentTheme = 'dark';

function App() {
  const globalState = useReducer(rootReducer, rootState);

  return (
    <ContextProvider value={globalState}>
      <ThemeProvider theme={THEME[currentTheme]}>
        <Routes />
        <GlobalStyle />
      </ThemeProvider>
    </ContextProvider>
  );
}

export default App;
