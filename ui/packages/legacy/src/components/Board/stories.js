
import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import THEME from '../../core/assets/themes'
import BoardDefault from './stories/default'
import BoardCustom from './stories/custom'


storiesOf('Components|Board', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}>{storyFn()}</ThemeProvider>)
  .add('default', () => <BoardDefault />)
  .add('custom', () => <BoardCustom />)
