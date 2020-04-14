import PropTypes from 'prop-types'
import React from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import pt from 'react-intl/locale-data/pt'
import en from 'react-intl/locale-data/en'
import ptBR from '../../core/i18n/pt-BR'
import enUS from '../../core/i18n/en-US'

addLocaleData([...pt, ...en])
addLocaleData({ locale: 'pt-BR', parentLocale: 'pt' })
addLocaleData({ locale: 'en-US', parentLocale: 'en' })

const messages = { 'en-US': enUS, 'pt-BR': ptBR }

const IntlProviderWrapper = ({ children, locale }) => (
  <IntlProvider locale={locale} messages={messages[locale]}>
    {children}
  </IntlProvider>
)

IntlProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.string.isRequired,
}

export default IntlProviderWrapper
