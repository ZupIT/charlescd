import React, { useReducer } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import Toaster from 'containers/Toaster'
import IntlProviderWrapper from 'components/IntlProviderWrapper'
import THEME from 'core/assets/themes'
import { getLanguage } from 'core/helpers/translate'
import StreamProvider from 'stream'
import { updateAbility } from 'core/helpers/ability'
import GlobalStyle from 'core/assets/style/global'
import routes from 'routes'
import RoutingContext from 'core/routing/RoutingContext'
import createRouter from 'core/routing/createRouter'
import RouterRenderer from 'core/routing/RouteRenderer'
import { Provider as ContextProvider } from 'core/state/store'
import { rootReducer, rootState } from 'core/state/reducer'
import { INDEX_ROUTE } from 'core/constants/routes'
import Notification from 'containers/Notification'
import sagas from './sagas'
import { store, sagaMiddleware } from './store'

sagaMiddleware.run(sagas)

updateAbility()

const router = createRouter(routes)

const App = () => {
  const useGlobalState = useReducer(rootReducer, rootState)

  return (
    <ContextProvider value={useGlobalState}>
      <Provider store={store}>
        <IntlProviderWrapper locale={getLanguage()}>
          <ThemeProvider theme={THEME}>
            <StreamProvider>
              <RoutingContext.Provider value={router.context}>
                <RouterRenderer indexRoute={INDEX_ROUTE} />
              </RoutingContext.Provider>
            </StreamProvider>
            <Notification />
            <Toaster />
            <GlobalStyle />
          </ThemeProvider>
        </IntlProviderWrapper>
      </Provider>
    </ContextProvider>
  )
}

export default App
