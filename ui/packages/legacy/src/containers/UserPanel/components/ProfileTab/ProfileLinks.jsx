import React from 'react'
import { useAuth } from 'core/helpers/auth'
import { StyledProfileDetails } from 'containers/UserPanel/components/styled'
import { Translate } from 'components/index'

const ProfileLinks = () => {
  const [logout] = useAuth()

  return (
    <>
      <StyledProfileDetails.ProfileDetailsLogout overshadow onClick={logout}>
        <Translate id="general.toolbar.signout" />
      </StyledProfileDetails.ProfileDetailsLogout>
    </>
  )
}

export default ProfileLinks
