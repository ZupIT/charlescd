import { useContext } from 'react'
import stateContext from './store'

export const useSelector = (cb) => {
  const [state] = useContext(stateContext)

  return cb(state)
}

export const useDispatch = () => {
  const [, dispatch] = useContext(stateContext)
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__?.connect({})

  return (action) => {
    if (devTools) {
      devTools.send(action?.type, { value: action })
    }
    dispatch(action)
  }
}
