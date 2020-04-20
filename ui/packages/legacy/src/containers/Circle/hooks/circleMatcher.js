import { useState } from 'react'
import { useDispatch } from 'react-redux'
import CircleMatcherAPI from 'core/api/circle-matcher'
import { onSaveError } from 'core/helpers/request'
import { toasterActions } from 'containers/Toaster/state/actions'
import { HTTP_STATUS_CODE } from 'core/constants/HTTPStatusCode'

export const useCircleMatcher = () => {
  const dispatch = useDispatch()
  const [circles, setCircles] = useState([])
  const [isLoading, setIsLoading] = useState()

  const getCircles = (data) => {
    setIsLoading(true)

    return CircleMatcherAPI.identifyCirclesWhenAuthenticated(data)
      .then(({ circles: circlesData }) => {
        setCircles(circlesData)
      })
      .catch((error) => {
        const { status } = error.response

        if (status === HTTP_STATUS_CODE.BAD_REQUEST) {
          dispatch(toasterActions.toastFailed('payload.invalid'))
        } else {
          onSaveError(error, dispatch)
        }
      })
      .finally(() => setIsLoading(false))
  }

  return [{ circles, isLoading }, { getCircles, setCircles }]
}
