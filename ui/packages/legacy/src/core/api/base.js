import Environment from 'core/helpers/environment'
import HttpClient from './http-client'

export const BaseApi = HttpClient.baseAuthenticated(Environment.getData('HOST'))

export const BaseApiNotification = HttpClient.baseAuthenticated(Environment.getData('NOTIFICATION'))

export const BaseRxApi = HttpClient.baseAuthObservable(Environment.getData('HOST'))

export const ApmBaseApi = HttpClient.baseAuthenticated(Environment.getData('APM'))

export const KeycloakBaseApi = HttpClient.baseUnauthenticated(Environment.getData('KEYCLOAK'))

export const CircleMatcherBaseApiUnauthenticated = HttpClient.baseUnauthenticated(Environment.getData('CIRCLE_MATCHER'))

export const CircleMatcherBaseApiAuthenticated = HttpClient.baseAuthenticated(Environment.getData('CIRCLE_MATCHER'))
