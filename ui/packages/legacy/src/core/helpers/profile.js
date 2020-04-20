import { Cookies } from 'react-cookie'
import get from 'lodash/get'
import { domain } from 'core/helpers/domain'
import { saveApplication } from 'core/helpers/application'

const cookies = new Cookies()
const STORAGE_PROFILE_KEY = 'profile'

export const clearUserProfile = () => {
  cookies.remove(STORAGE_PROFILE_KEY, { path: '/', domain })
}

export const getFirstApplication = (profile) => {
  const [application] = profile?.applications || []

  return application
}

export const saveUserProfile = (profile) => {
  clearUserProfile()
  saveApplication(getFirstApplication(profile))
  cookies.set(STORAGE_PROFILE_KEY, btoa(JSON.stringify(profile)), { path: '/', domain })
}

export const getUserProfile = () => {
  const profile = cookies.get(STORAGE_PROFILE_KEY, { path: '/', domain })

  return profile ? JSON.parse(atob(profile)) : ''
}

export const getUserProfileData = (data) => {
  const profile = getUserProfile()

  return get(profile, data, '')
}
