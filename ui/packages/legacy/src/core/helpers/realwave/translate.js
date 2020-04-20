const defaultLanguage = 'en-US'
const languagesAvailble = { 'en-US': true, 'pt-BR': true }

function isSupportedLanguage(language) {
  return !!languagesAvailble[language]
}

export function setLanguage(language, reload) {
  localStorage.setItem('rw.language', language)

  if (reload) {
    window.location.reload()
  }
}

export function getLanguage() {
  let currentLanguage = localStorage.getItem('rw.language')

  if (!currentLanguage) {
    setLanguage(navigator.language, false)

    currentLanguage = navigator.language
  }

  if (!isSupportedLanguage(currentLanguage)) {
    currentLanguage = defaultLanguage

    setLanguage(currentLanguage, false)
  }

  return currentLanguage
}

export function i18n(intl, i18nKey, values = {}) {
  return intl && intl.messages[i18nKey] ? intl.formatMessage({ id: i18nKey }, values) : i18nKey
}
