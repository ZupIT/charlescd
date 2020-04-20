import React, { useEffect } from 'react'
import { BehaviorSubject, throwError, forkJoin } from 'rxjs'
import CredentialsAPI from 'core/api/credentials'
import { catchError } from 'rxjs/operators'
import { combineLatest } from 'rxjs'

const connectionConfigStream = (Component) => {
  const initialState = {
    loading: false,
    git: [],
    registry: [],
    k8s: [],
  }

  const actions = store$ => ({
    getConfigs: () => {
      store$.next({ ...store$.getValue(), loading: true })
      return combineLatest(
          CredentialsAPI.getConfigs(),
          CredentialsAPI.getGitConfig()
        )
        .pipe(catchError(err => throwError(err)))
        .subscribe((data) => {
          const { git, ...withoutgit} = data[0]
          const { content } = data[1]
          const finalData = {
            git: content,
            ...withoutgit
          }
          store$.next({
            ...store$.getValue(),
            loading: false,
            ...finalData,
          })
        })
    },
  })

  return (props) => {
    const store$ = new BehaviorSubject(initialState)
    const actions$ = actions(store$)

    useEffect(() => {
      return () => store$.unsubscribe()
    }, [])

    return (
      <Component configStream={{ store$, actions$ }} {...props} />
    )
  }
}

export default connectionConfigStream
