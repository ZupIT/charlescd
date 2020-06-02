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

import React, { useReducer } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'core/assets/style/global';
import THEME from 'core/assets/themes';
import { Provider as ContextProvider } from 'core/state/store';
import { rootState, rootReducer } from 'core/state';
import { setUserAbilities } from 'core/utils/abilities';
import Routes from './Routes';

const currentTheme = 'dark';
setUserAbilities();

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
