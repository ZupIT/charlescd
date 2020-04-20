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
`;

export default GlobalStyle;
