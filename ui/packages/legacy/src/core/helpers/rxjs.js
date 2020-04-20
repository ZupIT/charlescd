import { Observable } from 'rxjs'

export const toggleLoading = (subject, loading) => source => (
  new Observable((observer) => {
    return source.subscribe({
      next() {
        const value = subject.getValue() || {}
        subject.next({ ...value, [loading]: !value[loading] })

        observer.next()
      },
      error(err) {
        const value = subject.getValue() || {}
        subject.next({ ...value, [loading]: !value[loading] })

        observer.error(err)
      },
      complete() { observer.complete() },
    })
  })
)
