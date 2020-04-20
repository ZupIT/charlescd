const startIndex = 0
const decrement = 1
const increment = 1

const combineStreams = (...streams) => (Component) => {
  function recursiveCombine(combine, index = startIndex) {
    if (index < (streams.length - decrement)) {
      const next = index + increment

      return recursiveCombine(streams[index](combine), next)
    }

    return streams[index](combine)
  }

  return recursiveCombine(Component)
}

export default combineStreams
