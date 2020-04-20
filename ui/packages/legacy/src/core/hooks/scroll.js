import { useEffect, useState } from 'react'

export function useScroll(onEnd, selector) {
  const [end, dispatch] = useState(false)

  function onScroll(event) {
    const el = event.currentTarget
    const screenH = el.offsetHeight || el.innerHeight
    const docH = el.scrollHeight || document.documentElement.offsetHeight
    const scrollTop = el.scrollTop || document.documentElement.scrollTop

    if ((screenH + scrollTop) >= docH) {
      dispatch(true)
    }
  }

  function initScroll(element) {
    element.addEventListener('scroll', (event) => {
      onScroll(event)
    })
  }

  useEffect(() => {
    if (end) {
      dispatch(false)
      onEnd()
    }
  }, [end])

  useEffect(() => {
    const element = selector ? document.querySelector(selector) : window

    initScroll(element)

    return () => {
      element.removeEventListener('scroll', (event) => {
        onScroll(event)
      })
    }

  }, [])
}
