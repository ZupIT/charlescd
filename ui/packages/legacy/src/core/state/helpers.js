export const combineReducer = (reducers) => {
  const reducerKeys = Object.keys(reducers)

  return (state = {}, action) => {
    let nextState = state

    reducerKeys.map((key) => {
      const reducer = reducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)

      nextState = { ...nextState, [key]: nextStateForKey }

      return key
    })

    return nextState
  }
}
