import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import rootReducer from './reducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose
export const sagaMiddleware = createSagaMiddleware()
export const history = createBrowserHistory()

const middlewares = [
  sagaMiddleware,
  routerMiddleware(history),
]

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
)
