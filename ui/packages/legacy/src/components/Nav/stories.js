
import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import THEME from '../../core/assets/themes'
import Nav from '.'

storiesOf('Components|Nav', module)
  .addDecorator(storyFn => <ThemeProvider theme={THEME}><IntlProvider locale="en">{storyFn()}</IntlProvider></ThemeProvider>)
  .add('default',
    () => {
      return (
        <section style={{ background: '#0062FF', width: '100vw', height: '100vh' }}>
          <div style={{ width: '300px' }}>
            <Nav
              items={[
                { label: 'Value flow' },
                { label: 'Circles' },
                { label: 'Modules' },
                { label: 'Quick board' },
              ]}
            />
          </div>
        </section>
      )
    })
