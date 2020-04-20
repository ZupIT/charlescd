import React, { useEffect } from 'react'
import { BehaviorSubject, throwError } from 'rxjs'
import { toggleLoading } from 'core/helpers/rxjs'
import CredentialsAPI from 'core/api/credentials'
import { catchError } from 'rxjs/operators'

const connectionK8sStream = (Component) => {
  const initialState = {
    loading: false,
  }

  const actions = store$ => ({
    saveK8s: (data) => {
      store$.next({ loading: true })

      return CredentialsAPI
        .saveK8s(data)
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
      <Component k8sStream={{ store$, actions$ }} {...props} />
    )
  }
}

export default connectionK8sStream
