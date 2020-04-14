const debounce = (() => {
  let timer = null

  return (fn, wait) => {
    clearTimeout(timer)
    timer = setTimeout(fn, wait)
  }
})()

export default debounce
