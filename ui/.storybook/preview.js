import { ThemeProvider } from 'styled-components';
import THEME from 'core/assets/themes';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/,
    },
  },
  layout: 'centered',
}

export const decorators = [
  (Story) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
      <ThemeProvider theme={THEME.dark}><Story /></ThemeProvider>
    </div>
  )
]
