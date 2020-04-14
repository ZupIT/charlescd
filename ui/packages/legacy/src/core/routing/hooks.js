import { useContext } from 'react'
import find from 'lodash/find'
import get from 'lodash/get'
import { getPath } from 'core/helpers/routes'
import RouterContext from './RoutingContext'

export const useRouter = () => {
  const { history } = useContext(RouterContext)

  return {
    history,
    push: (path, ...args) => history.push(getPath(path, args)),
    goBack: () => history.goBack(),
    go: (path, ...args) => history.go(getPath(path, args)),
  }
}

export const useParams = () => {
  const router = useContext(RouterContext)

  const { pathname } = router.history.location
  const { entries } = router.get()
  const currentEntry = find(entries, ({ routeData: { url } }) => url === pathname)

  return get(currentEntry?.routeData, 'params')
}


export const useRedirect = (to) => {
  const router = useContext(RouterContext)

  return () => router.history.go(to)
}
