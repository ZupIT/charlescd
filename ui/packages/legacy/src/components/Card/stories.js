import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import THEME from '../../core/assets/themes'
import Card from '.'

storiesOf('Components|Card', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}>{storyFn()}</ThemeProvider>)
  .add('default', () => <Card> </Card>)
  .add('default for circles', () => (
    <Card themeCircle />
  ))
