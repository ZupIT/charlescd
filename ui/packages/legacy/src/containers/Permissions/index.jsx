import React from 'react'
import Translate from 'components/Translate'
import {
  SETTINGS_PERMISSIONS_GROUPS,
  SETTINGS_PERMISSIONS_USERS,
  SETTINGS_PERMISSIONS_WORKSPACE,
} from 'core/constants/routes'
import Styled from './styled'


const Permissions = ({ children }) => (
  <Styled.Wrapper>
    <Styled.Nav to={SETTINGS_PERMISSIONS_GROUPS} activeClassName="active">
      <Translate id="permissions.nav.groups" />
    </Styled.Nav>
    <Styled.Nav to={SETTINGS_PERMISSIONS_USERS} activeClassName="active">
      <Translate id="permissions.nav.users" />
    </Styled.Nav>
    <Styled.Nav to={SETTINGS_PERMISSIONS_WORKSPACE} activeClassName="active">
      <Translate id="Workspaces" />
    </Styled.Nav>
    <Styled.Content>
      { children }
    </Styled.Content>
  </Styled.Wrapper>
)

export default Permissions
