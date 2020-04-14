export const init = {
  responseMode: 'fragment',
  flow: 'hybrid',
  checkLoginIframe: false,
  onLoad: 'check-sso',
}

export const config = {
  url: `${global.ENVIRONMENT.KEYCLOAK}/auth`,
  clientId: 'realwave_backoffice_ui',
}
