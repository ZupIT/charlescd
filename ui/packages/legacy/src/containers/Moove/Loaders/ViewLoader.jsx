import React from 'react'
import ContentLoader from 'react-content-loader'
import { StyledMoove } from 'containers/Moove/styled'
import { ContentLayer } from 'components/index'
import MembersIcon from 'core/assets/svg/members.svg'
import SidebarSVG from 'core/assets/svg/sidebar.svg'
import FlashIcon from 'core/assets/svg/flash.svg'


const ItemLoading = () => (
  <ContentLoader
    height="18"
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="0" y="-2" rx="0" ry="0" width="380" height="15" />
  </ContentLoader>
)

const ViewLoader = () => (
  <StyledMoove.Card.Wrapper>
    <ContentLayer icon={<SidebarSVG />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
    <ContentLayer icon={<MembersIcon />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
    <ContentLayer icon={<FlashIcon />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
  </StyledMoove.Card.Wrapper>
)

export default ViewLoader
