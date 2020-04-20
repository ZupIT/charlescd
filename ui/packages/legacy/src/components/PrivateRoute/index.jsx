import React from 'react'
import { isAuthenticated } from 'core/helpers/auth'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/auth/login',
          state: { from: props.location },
        }}
        />
      )
    )}
  />
)

export default PrivateRoute
