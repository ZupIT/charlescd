import React, { useContext, useEffect, Suspense, useState } from 'react'
import last from 'lodash/last'
import { ERRORS } from 'core/constants/routes'
import RoutingContext from './RoutingContext'
import ErrorBoundary from '../../ErrorBoundary'
import './RouteRenderer.css'


const RouteComponent = (props) => {
  const Component = props.component.read()
  const { routeData, prepared } = props

  return (
    <Component
      routeData={routeData}
      prepared={prepared}
    >
      {props.children}
    </Component>
  )
}


const RouterRenderer = ({ indexRoute }) => {
  const router = useContext(RoutingContext)
  const [routeEntry, setRouteEntry] = useState(router.get())
  useEffect(() => {
    const { history: { location } } = router

    if (location.pathname === '/') {
      window.location.href = indexRoute
    }

  }, [])

  useEffect(() => {
    const currentEntry = router.get()
    if (currentEntry !== routeEntry) {
      return setRouteEntry(currentEntry)
    }

    const dispose = router.subscribe((nextEntry) => {
      setRouteEntry(nextEntry)
    })

    return () => dispose()
  }, [router])

  const reversedItems = [].concat(routeEntry.entries).reverse()
  const firstItem = reversedItems[0]
  const secondItem = 1
  const increment = 1
  const { history: { location } } = router
  const lastEntry = last(routeEntry?.entries)

  if (lastEntry?.routeData.url !== location.pathname) {
    window.location.href = ERRORS

    return
  }

  if (firstItem?.redirect) {
    window.location.href = firstItem?.redirect
  }

  let routeComponent = (
    <RouteComponent
      component={firstItem.component}
      prepared={firstItem.prepared}
      routeData={firstItem.routeData}
    />
  )
  for (let i = secondItem; i < reversedItems.length; i += increment) {
    const nextItem = reversedItems[i]
    routeComponent = (
      <RouteComponent
        component={nextItem.component}
        prepared={nextItem.prepared}
        routeData={nextItem.routeData}
      >
        {routeComponent}
      </RouteComponent>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense fallback="">
        {routeComponent}
      </Suspense>
    </ErrorBoundary>
  )
}

export default RouterRenderer
