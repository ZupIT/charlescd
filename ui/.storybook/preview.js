import { ThemeProvider } from 'styled-components';
import THEME from 'core/assets/themes';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={THEME.dark}><Story /></ThemeProvider>
  )
]
