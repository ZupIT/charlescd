import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import THEME from '../../core/assets/themes'
import Switch from '.'

storiesOf('Components|Switch', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}><IntlProvider locale="en">{storyFn()}</IntlProvider></ThemeProvider>)
  .add('enable', () => {
    return (
      <Switch value onChange={() => {}} />
    )
  })
  .add('disable', () => {
    return (
      <Switch value={false} onChange={() => {}} />
    )
  })
