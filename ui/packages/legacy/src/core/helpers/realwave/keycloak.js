import Keycloak from 'keycloak-js'
import { init, config } from './keycloakConstants'
import { getSlug } from './auth'

function buildKeycloakConfig() {
  const slug = getSlug()

  return { ...config, realm: slug }
}
const keycloak = Keycloak(buildKeycloakConfig())

export function getKeycloak() {
  return keycloak
}

export function initKeycloak(callback) {
  keycloak
    .init(init)
    .success(authenticated => authenticated ? callback.call(this) : keycloak.login())
}
