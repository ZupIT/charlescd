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

import { ThemeProvider } from 'styled-components';
import THEME from 'core/assets/themes';

export const parameters = {
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#1C1C1E',
      },
      {
        name: 'light',
        value: 'FFF',
      }
    ],
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/,
    },
    sort: 'requiredFirst'
  },
  layout: 'centered',
};

export const decorators = [
  (Story) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
      <div>
        <ThemeProvider theme={THEME.dark}><Story /></ThemeProvider>
      </div>
    </div>
  )
]
