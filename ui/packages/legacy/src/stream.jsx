import React, { createContext, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

export const StreamContext = createContext()

const StreamProvider = ({ children }) => {
  const store$ = new BehaviorSubject({})

  useEffect(() => {
    return () => store$.unsubscribe()

  }, [])

  const context = {
    store$,
    initialize: (field, initialValues) => store$.getValue()[field] || initialValues,
  }

  return (
    <StreamContext.Provider value={context}>
      {children}
    </StreamContext.Provider>
  )
}

export default StreamProvider
