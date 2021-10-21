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

import { createGlobalStyle } from 'styled-components';
import { getTheme } from 'core/utils/themes';

const theme = getTheme();

const GlobalStyle = createGlobalStyle`
  html,
    body {
      margin: 0;
      padding: 0;
      font-family: 'Lato', sans-serif;
    }
  a {
    text-decoration: none;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: dark;

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.scroll.track};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${theme.scroll.thumb};
    }
  }

  *:focus {
    outline: none;
  }

  textarea,
  select,
  input {
    filter: none;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: ${theme.input.color};
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export default GlobalStyle;
