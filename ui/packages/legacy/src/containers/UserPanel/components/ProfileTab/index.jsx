import React from 'react'
import ProfileDetails from './ProfileDetails'
import ProfileLinks from './ProfileLinks'
import WorkspacesList from './WorkspacesList'
import { StyledProfileDetails } from '../styled'

const ProfileTab = () => (
  <StyledProfileDetails.ProfileDetailsContainer>
    <ProfileDetails />
    <WorkspacesList />
    <StyledProfileDetails.HorizontalDivider inverted />
    <ProfileLinks />
  </StyledProfileDetails.ProfileDetailsContainer>
)

export default React.memo(ProfileTab)
