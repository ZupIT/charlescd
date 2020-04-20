import { createGlobalStyle, css } from 'styled-components'
import MediumStyle from './medium'
import DraftStyle from './draft'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap');

  html,
    body {
      margin: 0;
      padding: 0;
      font-family: 'Roboto', sans-serif;
      ${({ theme: { DEFAULT } }) => DEFAULT && css`
        background: ${DEFAULT.BODY_BACKGROUND};
        color: ${DEFAULT.FONT_COLOR};
      `};
    }

  * {
    scrollbar-width: thin;
    scrollbar-color: dark;

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      ${({ theme: { DEFAULT } }) => DEFAULT && css`
        background: ${DEFAULT.BODY_BACKGROUND};
      `};
    }

    ::-webkit-scrollbar-thumb {
      ${({ theme: { DEFAULT } }) => DEFAULT && css`
        background-color: ${DEFAULT.FONT_COLOR};
      `};
    }
  }

  *:focus {
    outline: none;
  }

  ${MediumStyle};
  ${DraftStyle};
`

export default GlobalStyle
