import { createGlobalStyle } from 'styled-components';
import { COLOR_SANTAS_GREY, COLOR_BLACK_RUSSIAN } from '../colors';

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
      background: ${COLOR_BLACK_RUSSIAN};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${COLOR_SANTAS_GREY};
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
