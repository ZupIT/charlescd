import React from 'react'
import ContentLoader from 'react-content-loader'
import { StyledMoove } from 'containers/Moove/styled'
import { ContentLayer } from 'components/index'
import InfoDarkOutlinedSVG from 'core/assets/svg/info-outlined-dark.svg'
import CandidateSVG from 'core/assets/svg/ic_rel_candidate_dark.svg'

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
    <ContentLayer icon={<CandidateSVG />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
    <ContentLayer icon={<InfoDarkOutlinedSVG />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
    <ContentLayer icon={<CandidateSVG />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
  </StyledMoove.Card.Wrapper>
)

export default ViewLoader
