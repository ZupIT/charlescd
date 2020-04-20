import React, { useEffect } from 'react'
import { BehaviorSubject, throwError } from 'rxjs'
import { toggleLoading } from 'core/helpers/rxjs'
import CredentialsAPI from 'core/api/credentials'
import { catchError } from 'rxjs/operators'

const connectionGitStream = (Component) => {
  const initialState = {
    loading: false,
  }

  const actions = store$ => ({
    saveGit: (data) => {
      store$.next({ loading: true })

      return CredentialsAPI
        .saveGit(data)
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
      <Component gitStream={{ store$, actions$ }} {...props} />
    )
  }
}

export default connectionGitStream
