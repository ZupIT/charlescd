import { useState } from 'react'
import { useDispatch } from 'react-redux'
import qs from 'querystring'
import isEmpty from 'lodash/isEmpty'
import { toasterActions } from 'containers/Toaster/state/actions'
import AuthAPI from 'core/api/auth'
import UsersAPI from 'core/api/users'
import CircleMatcherAPI from 'core/api/circle-matcher'
import { saveSessionData, clearSession } from 'core/helpers/auth'
import { saveUserProfile } from 'core/helpers/profile'
import { saveCircleID } from 'core/helpers/circle'
import { useRouter } from 'core/routing/hooks'
import { DAHSBOARD_NOT_FOUND, ROOT } from 'core/constants/routes'

const getSession = (email, password) => {
  return AuthAPI.doLogin(email, password)
    .then(({ access_token, refresh_token }) => saveSessionData(access_token, refresh_token))
}

const getUserData = (email) => {
  return UsersAPI.getUserByEmail(email)
    .then((userData) => {
      saveUserProfile(userData)

      return userData
    })
}

const getCircleID = (email) => {
  return CircleMatcherAPI.identifyCirclesWhenUnauthenticated({ username: email })
    .then(({ circles }) => {
      const [circle] = circles
      saveCircleID(circle?.id)
    })
}

const isNotAuthorized = errorMessage => errorMessage.includes('400')

export const useLogin = () => {
  const dispatch = useDispatch()
  const { history: { location } } = useRouter()
  const [loading, toggleLoading] = useState(false)

  const doLogin = async (email, password) => {
    try {
      toggleLoading(true)
      clearSession()
      await getSession(email, password)
      await getCircleID(email)
      const { applications } = await getUserData(email)

      if (isEmpty(applications)) {
        window.location.replace(DAHSBOARD_NOT_FOUND)
      } else {
        const startIndex = 1
        const { redirectTo } = qs.parse(location.search.substring(startIndex))
        const url = !isEmpty(redirectTo) ? redirectTo : ROOT

        window.location.replace(url)
      }
    } catch (e) {
      const currentErrorMesage = isNotAuthorized ? 'auth.login.error.notFound' : ''
      dispatch(toasterActions.toastFailed(currentErrorMesage))
    } finally {
      toggleLoading(false)
    }

  }

  return [loading, doLogin]
}
