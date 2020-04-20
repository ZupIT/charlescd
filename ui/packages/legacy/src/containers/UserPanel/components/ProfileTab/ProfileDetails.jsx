import React from 'react'
import { useRouter } from 'core/routing/hooks'
import { getPath } from 'core/helpers/routes'
import {
  SETTINGS_PERMISSIONS_USERS_GROUPS,
} from 'core/constants/routes'
import { StyledProfileDetails } from 'containers/UserPanel/components/styled'
import { getUserProfileData } from 'core/helpers/profile'
import { Translate } from 'components/index'

const ProfileDetails = () => {
  const history = useRouter()

  return (
    <StyledProfileDetails.ProfileDetailsUser>
      <StyledProfileDetails.ProfileDetailsUserPicture src={getUserProfileData('photoUrl')} alt="img" />
      <StyledProfileDetails.ProfileDetailsUserOptions>
        <StyledProfileDetails.ProfileDetailsUserInformation>
          <StyledProfileDetails.ProfileDetailsUserInformationName>
            { getUserProfileData('name') }
          </StyledProfileDetails.ProfileDetailsUserInformationName>
          <StyledProfileDetails.ProfileDetailsUserInformationEmail>
            { getUserProfileData('email') }
          </StyledProfileDetails.ProfileDetailsUserInformationEmail>
        </StyledProfileDetails.ProfileDetailsUserInformation>
        <StyledProfileDetails.ProfileDetailsUserOptionsButton
          size="MEDIUM"
          onClick={() => history.push(getPath(SETTINGS_PERMISSIONS_USERS_GROUPS,
            [getUserProfileData('id'), btoa(getUserProfileData('email'))]))}
        >
          <Translate id="general.toolbar.editProfile" />
        </StyledProfileDetails.ProfileDetailsUserOptionsButton>
      </StyledProfileDetails.ProfileDetailsUserOptions>
    </StyledProfileDetails.ProfileDetailsUser>
  )
}

export default ProfileDetails
