import {
  SETTINGS_CREDENTIALS,
  SETTINGS_CREDENTIALS_GIT,
  SETTINGS_CREDENTIALS_K8S,
  SETTINGS_CREDENTIALS_REGISTRY,
} from 'core/constants/routes'
import JSResource from 'core/routing/JSResource'

export default [
  {
    exact: true,
    path: SETTINGS_CREDENTIALS,
    component: JSResource('Credentials', () => import('containers/Credentials/Main')),
  },
  {
    path: SETTINGS_CREDENTIALS_GIT,
    component: JSResource('Credentials git', () => import('containers/Credentials/Git')),
  },
  {
    path: SETTINGS_CREDENTIALS_K8S,
    component: JSResource('Credentials k8s', () => import('containers/Credentials/K8s')),
  },
  {
    path: SETTINGS_CREDENTIALS_REGISTRY,
    component: JSResource('Credentials registry', () => import('containers/Credentials/Registry')),
  },
]
