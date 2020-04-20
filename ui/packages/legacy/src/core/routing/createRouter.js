import { createBrowserHistory } from 'history'
import { matchRoutes } from 'react-router-config'

const matchRoute = (routes, location) => {
  const emptyMatchedRoutes = 0
  const matchedRoutes = matchRoutes(routes, location.pathname)
  if (!Array.isArray(matchedRoutes) || matchedRoutes.length === emptyMatchedRoutes) {
    throw new Error(`No route for ${location.pathname}`)
  }

  return matchedRoutes
}

const prepareMatches = (matches) => {
  return matches.map((match) => {
    const { route, match: matchData } = match
    const prepared = route.prepare ? route.prepare(matchData.params) : () => ({})
    const Component = route.component.get()
    if (Component == null) {
      route.component.load()
    }

    return { component: route.component, redirect: route?.redirect, prepared, routeData: matchData }
  })
}

export const history = createBrowserHistory()

export default (routes) => {
  const initialMatches = matchRoute(routes, history.location)
  const initialEntries = prepareMatches(initialMatches)
  let currentEntry = {
    location: history.location,
    entries: initialEntries,
  }
  const nextId = 0
  const subscribers = new Map()

  const cleanup = history.listen((location) => {
    if (location.pathname === currentEntry.location.pathname) {
      return
    }
    const matches = matchRoute(routes, location)
    const entries = prepareMatches(matches)
    const nextEntry = {
      location,
      entries,
    }
    currentEntry = nextEntry
    subscribers.forEach(cb => cb(nextEntry))
  })


  const context = {
    history,
    get() {
      return currentEntry
    },
    preloadCode(pathname) {
      const matches = matchRoutes(routes, pathname)
      matches.forEach(({ route }) => route.component.load())
    },
    preload(pathname) {
      const matches = matchRoutes(routes, pathname)
      prepareMatches(matches)
    },
    subscribe(cb) {
      const increment = 1
      const id = nextId + increment
      const dispose = () => {
        subscribers.delete(id)
      }
      subscribers.set(id, cb)

      return dispose
    },
  }

  return { cleanup, context }
}
