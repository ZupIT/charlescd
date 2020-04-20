import React, { useEffect } from 'react'
import { BehaviorSubject, throwError } from 'rxjs'
import { toggleLoading } from 'core/helpers/rxjs'
import ModulesAPI from 'core/api/modules'
import { catchError } from 'rxjs/operators'
import { ONE } from 'core/helpers/constants'

export const initialState = {
  loading: false,
  module: {},
  list: {
    content: [],
    page: -1,
    last: false,
  },
}

const connectionModuleStream = (Component) => {

  const actions = store$ => ({
    getModule: (moduleId) => {
      if (moduleId) {
        store$.next({ ...store$.getValue(), loading: true })
        ModulesAPI
          .findById(moduleId)
          .subscribe(module => (
            store$.next({
              ...store$.getValue(),
              module,
              loading: false,
            })
          ))
      }
    },
    getModules: () => {
      const store = store$.getValue()
      const page = store.list.page + ONE

      store$.next({ ...store, loading: true })

      return ModulesAPI
        .getModulesRx(page)
        .pipe(catchError(err => throwError(err)))
        .subscribe((data) => {
          store$.next({
            ...store,
            loading: false,
            list: {
              ...data,
              content: [...store.list.content, ...data.content],
            },
          })
        })
    },
    saveModule: (module) => {
      store$.next({ ...store$.getValue(), loading: true, module })

      return ModulesAPI
        .saveModule(module)
        .pipe(
          toggleLoading(store$, 'loading'),
          catchError(err => throwError(err)),
        )
    },
    updateModule: (moduleId, module) => {
      store$.next({ ...store$.getValue(), loading: true, module })

      return ModulesAPI
        .updateModule(moduleId, module)
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
      <Component moduleStream={{ store$, actions$ }} {...props} />
    )
  }
}

export default connectionModuleStream
