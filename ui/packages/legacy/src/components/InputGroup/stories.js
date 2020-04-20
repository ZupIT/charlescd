import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import THEME from '../../core/assets/themes'
import InputGroup from '.'

storiesOf('Components|InputGroup', module)
  .addDecorator(storyFn => (
    <ThemeProvider theme={THEME}>
      <IntlProvider locale="en">{storyFn()}</IntlProvider>
    </ThemeProvider>
  ))
  .add('default', () => <InputGroup> </InputGroup>)
