import React, { useCallback, useContext } from 'react'
import includes from 'lodash/includes'
import RoutingContext from './RoutingContext'

const Link = ({ className, to, children }) => {
  const router = useContext(RoutingContext)

  const changeRoute = useCallback((event) => {
    event.preventDefault()

    if (includes(to, 'http')) {
      window.location.href = to
    } else {
      router.history.push(to)
    }


  }, [to, router])

  const preloadRouteCode = useCallback(() => {
    router.preloadCode(to)
  }, [to, router])

  const preloadRoute = useCallback(() => {
    router.preload(to)
  }, [to, router])

  return (
    <a
      className={className}
      href={to}
      onClick={changeRoute}
      onMouseEnter={preloadRouteCode}
      onMouseDown={preloadRoute}
    >
      {children}
    </a>
  )
}

export default Link
