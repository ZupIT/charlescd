import forEach from 'lodash/forEach'
import replace from 'lodash/replace'
import { useDispatch } from 'react-redux'
import { push, replace as replaceAction, goBack, go, goForward } from 'react-router-redux'
import development from './development'

function replaceRoute(path, pathParams, params) {
  let newPath = path

  forEach(params, (param, index) => {
    newPath = replace(newPath, pathParams[index], params[index])
  })

  return newPath
}

export function getPath(path = '', params = []) {
  try {
    const pathParams = path.match(/:+\w*/gi)

    if (pathParams === null) {
      return path
    }

    if (pathParams.length !== params.length) {
      console.error({
        message: 'ERROR: params size is different of path size',
        params,
        path,
      })
    }

    return replaceRoute(path, pathParams, params)

  } catch (err) {
    return console.log(err)
  }
}

export const useRouter = () => {
  const dispatch = useDispatch()

  return {
    push: (path, params) => dispatch(push(getPath(path, params))),
    replace: (path, params) => dispatch(replaceAction(getPath(path, params))),
    goBack: () => dispatch(goBack()),
    go: index => dispatch(go(index)),
    goForward: () => dispatch(goForward()),
  }
}

export const getQuery = () => new URLSearchParams(window.location.search)

export const getV2Path = (path) => {
  const { hostname } = window.location
  const v2ProductionHostname = `https://${hostname}`

  return development.isDevelopment() ? `${development.pathDevelopmentV2}${path}` : `${v2ProductionHostname}/v2${path}`
}
