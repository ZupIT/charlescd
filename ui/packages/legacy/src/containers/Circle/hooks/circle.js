import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'core/routing/hooks'
import CirclesAPI from 'core/api/circles'
import { ERRORS } from 'core/constants/routes'
import { HTTP_STATUS_CODE } from 'core/constants/HTTPStatusCode'
import { circleActions } from 'containers/Circle/state/actions'
import { ENGINE } from 'containers/Circle/Form/Profile/constants'
import { onSaveError } from 'core/helpers/request'
import { RELEASE_TYPES } from 'containers/Moove/constants'

const initCircleState = {
  ruleMatcherType: ENGINE.DEFAULT,
  deployment: {},
}

export const useCircle = (circleId) => {
  const [circle, setCircle] = useState(initCircleState)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const history = useRouter()

  function deployingOrUndeploying() {
    const { status } = circle.deployment || {}
    const deploying = status === RELEASE_TYPES.DEPLOYING
    const undeploying = status === RELEASE_TYPES.UNDEPLOYING

    return (deploying || undeploying)
  }

  function getCircle(id) {
    if (!id) {
      return Promise.resolve()
    }

    if (!deployingOrUndeploying()) {
      setLoading(true)
    }

    return CirclesAPI.findById(id)
      .then(setCircle)
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_FOUND) {
          history.push(ERRORS)
        }
      })
      .finally(() => setLoading(false))
  }

  async function saveCircle(data) {
    try {
      const response = await CirclesAPI.createCircle(data)
      dispatch(circleActions.getCircles())

      return response
    } catch (error) {
      onSaveError(error, dispatch)

      return Promise.reject(error)
    }
  }

  function updateCircle(data) {
    setLoading(true)

    return CirclesAPI.updateCircle(circleId, data)
      .then((response) => {
        getCircle(circleId)
        return response
      })
      .catch(error => {
        setLoading(false)
        return onSaveError(error, dispatch)
      })
  }

  useEffect(() => {
    let timer = null
    const delay = 15000

    if (deployingOrUndeploying()) {
      timer = setTimeout(() => {
        getCircle(circleId)
      }, delay)
    }

    return () => clearTimeout(timer)

  }, [circle])

  return [
    { circle, loading },
    {
      saveCircle,
      updateCircle,
      getCircle,
      setCircle,
    },
  ]
}
