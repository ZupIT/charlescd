import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import THEME from '../../core/assets/themes'
import Title from '.'

storiesOf('Components|Title', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}><IntlProvider locale="en">{storyFn()}</IntlProvider></ThemeProvider>)
  .add('primary - h1', () => {
    return (
      <Title primary text="Create Circle" />
    )
  })
  .add('secondary - h2', () => {
    return (
      <Title secondary text="Create Circle" />
    )
  })
  .add('default - h3', () => {
    return (
      <Title text="Create Circle" />
    )
  })
