
import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import THEME from '../../core/assets/themes'
import Moove from '.'

storiesOf('Components|Moove', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}>{storyFn()}</ThemeProvider>)
  .add('default', () => <Moove> </Moove>)
