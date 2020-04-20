import React from 'react'
import PropTypes from 'prop-types'
import { StyledProfileTab } from './styled'
import ProfileTab from './ProfileTab'
import AlertsTab from './AlertsTab'
import { TAB } from '../constants'

const ProfileTabMenu = (props) => {
  const { openToolbar, activeTab } = props

  return (
    <StyledProfileTab.ProfileTabContainer open={openToolbar}>
      <StyledProfileTab.ProfileTabContainerPlaceholder />
      <StyledProfileTab.ProfileTabContainerContent>
        <StyledProfileTab.ProfileTabStep tab={TAB.PROFILE === activeTab}>
          <ProfileTab />
        </StyledProfileTab.ProfileTabStep>
        <StyledProfileTab.ProfileTabStep tab={TAB.NOTIFICATIONS === activeTab}>
          <AlertsTab />
        </StyledProfileTab.ProfileTabStep>
      </StyledProfileTab.ProfileTabContainerContent>
    </StyledProfileTab.ProfileTabContainer>
  )
}

ProfileTabMenu.defaultProps = {
  activeTab: TAB.DEFAULT,
}

ProfileTabMenu.propTypes = {
  openToolbar: PropTypes.bool.isRequired,
  activeTab: PropTypes.string,
}

export default ProfileTabMenu
