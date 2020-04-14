import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'core/routing/hooks'
import buildAPI from 'core/api/builds'
import deploymentAPI from 'core/api/deployment'
import { toasterActions } from 'containers/Toaster/state/actions'
import { getUserProfileData } from 'core/helpers/profile'
import { ONE, ZERO } from 'core/helpers/constants'
import { RELEASE_TYPES } from 'containers/Moove/constants'

const initialBuildState = {
  content: [],
  page: -1,
  last: false,
  lastSearch: '',
}

export const useRelease = () => {
  const authorId = getUserProfileData('id')
  const [builds, setBuilds] = useState(initialBuildState)
  const [loading, setLoading] = useState(false)
  const [loadingDeploy, setLoadingDeploy] = useState(false)
  const dispatch = useDispatch()
  const { circleId } = useParams()

  function getParams(tagName) {
    const page = builds.lastSearch === tagName ? builds.page + ONE : ZERO
    const status = RELEASE_TYPES.BUILT

    return { tagName, page, status }
  }

  async function createDeployment(build) {
    try {
      setLoadingDeploy(true)

      return await deploymentAPI.create({
        buildId: build.id,
        authorId,
        circleId,
      })

    } catch (e) {
      return dispatch(toasterActions.toastFailed(e.message))

    } finally {
      setLoadingDeploy(false)

    }
  }

  async function buildDeploy(data) {
    try {
      setLoadingDeploy(true)
      const build = await buildAPI.buildCompose({ ...data, authorId })

      return await createDeployment(build)

    } catch (e) {
      return dispatch(toasterActions.toastFailed(e.message))

    } finally {
      setLoadingDeploy(false)
    }
  }

  async function getBuildsByName(tagName = '') {
    try {
      setLoading(true)
      const response = await buildAPI.findByName(getParams(tagName))

      if (response.content.length) {
        const content = tagName === builds.lastSearch
          ? [...builds.content, ...response.content]
          : response.content

        setBuilds({ ...response, content, lastSearch: tagName })
      }

    } catch (e) {
      dispatch(toasterActions.toastFailed(e.message))
    } finally {
      setLoading(false)
    }
  }

  async function undeploy(deploymentId) {
    try {
      setLoading(true)

      return await deploymentAPI.undeploy(deploymentId)

    } catch (e) {
      dispatch(toasterActions.toastFailed(e.message))

      return Promise.reject(e)

    } finally {
      setLoading(false)
    }
  }

  return [
    {
      builds,
      loading,
      loadingDeploy,
    },
    {
      setBuilds,
      buildDeploy,
      getBuildsByName,
      createDeployment,
      undeploy,
    },
  ]
}
