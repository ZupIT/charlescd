import { Cookies } from 'react-cookie'
import { domain } from 'core/helpers/domain'
import { getUserProfileData } from './profile'

const cookies = new Cookies()
const STORAGE_APPLICATION_KEY = 'application'

export const clearApplication = () => {
  cookies.remove(STORAGE_APPLICATION_KEY, { path: '/', domain })
}

export const saveApplication = (application) => {
  clearApplication()

  if (application) {
    cookies.set(STORAGE_APPLICATION_KEY, application.id, { path: '/', domain })
  }
}

export const getApplication = () => {
  return cookies.get(STORAGE_APPLICATION_KEY, { path: '/', domain })
}

export const getApplications = () => {
  return getUserProfileData('applications')
}
