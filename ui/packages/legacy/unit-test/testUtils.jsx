import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { ThemeProvider } from 'styled-components'
import IntlProviderWrapper from 'components/IntlProviderWrapper'
import THEME from 'core/assets/themes'

const defaultLocale = 'en-US'

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={THEME}>
      <IntlProviderWrapper locale={defaultLocale}>
        {children}
      </IntlProviderWrapper>
    </ThemeProvider>
  )
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'

export { customRender as render }
