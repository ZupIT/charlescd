import React from 'react'
import UserPanel from 'containers/UserPanel'
import Sidebar from './Sidebar'
import Styled from './styled'


const Settings = ({ children }) => {
  return (
    <Styled.Wrapper>
      <Sidebar />
      <UserPanel />
      <Styled.Content>
        {children}
      </Styled.Content>
    </Styled.Wrapper>
  )
}

export default Settings
