
import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import THEME from '../../core/assets/themes'
import Rocket from '.'

storiesOf('Animations|Rocket', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}>{storyFn()}</ThemeProvider>)
  .add('default', () => {
    return (
      <div style={{ height: '100vh', backgroundColor: '#0062ff' }}>
        <Rocket />
      </div>
    )
  }, { notes: { markdown: 'testando markdown' } })
