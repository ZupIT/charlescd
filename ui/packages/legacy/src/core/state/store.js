import React from 'react'

const authContext = React.createContext({})

export const { Provider } = authContext
export const { Consumer } = authContext
export default authContext
