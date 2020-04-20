const defaultLanguage = 'en-US'
const availables = ['en-US', 'pt-BR']

const isSupportedLanguage = (language) => {
  return availables.includes(language)
}

export const setLanguage = (language, reload) => {
  localStorage.setItem('zup.language', language)

  if (reload) {
    window.location.reload()
  }
}

export const getLanguage = () => {
  const language = localStorage.getItem('zup.language')

  if (!language) {
    setLanguage(navigator.language, true)
  }

  if (!isSupportedLanguage(language)) {
    setLanguage(defaultLanguage, false)
  }

  return language
}

export function i18n(intl, i18nKey = 'general.dash', values = {}) {

  return intl && i18nKey && intl.messages[i18nKey] ? intl.formatMessage(
    { id: i18nKey }, values,
  ) : i18nKey
}
