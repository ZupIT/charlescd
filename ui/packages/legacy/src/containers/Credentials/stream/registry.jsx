import React, { useEffect } from 'react'
import { BehaviorSubject, throwError } from 'rxjs'
import { toggleLoading } from 'core/helpers/rxjs'
import CredentialsAPI from 'core/api/credentials'
import { catchError } from 'rxjs/operators'

const connectionRegistryStream = (Component) => {
  const initialState = {
    loading: false,
  }

  const actions = store$ => ({
    saveRegistry: (data) => {
      store$.next({ loading: true })

      return CredentialsAPI
        .saveRegistry(data)
        .pipe(
          toggleLoading(store$, 'loading'),
          catchError(err => throwError(err)),
        )
    },
  })

  return (props) => {
    const store$ = new BehaviorSubject(initialState)
    const actions$ = actions(store$)

    useEffect(() => {
      return () => store$.unsubscribe()
    }, [])

    return (
      <Component registryStream={{ store$, actions$ }} {...props} />
    )
  }
}

export default connectionRegistryStream
