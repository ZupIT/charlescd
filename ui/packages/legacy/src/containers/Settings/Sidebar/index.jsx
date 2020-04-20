import React from 'react'
import { Sidebar } from 'components'
import { SETTINGS_PERMISSIONS, SETTINGS_CREDENTIALS } from 'core/constants/routes'
import PermissionsSVG from 'core/assets/svg/permissions.svg'
import CredentialsSVG from 'core/assets/svg/credentials.svg'
import Styled from './styled'

const SettingsSidebar = () => (
  <Styled.Wrapper isOpen>
    <Sidebar.Item
      icon={<PermissionsSVG />}
      textId="general.permissions"
      to={SETTINGS_PERMISSIONS}
    />
    <Sidebar.Item
      icon={<CredentialsSVG />}
      textId="general.credentials"
      to={SETTINGS_CREDENTIALS}
    />
  </Styled.Wrapper>
)

export default SettingsSidebar
