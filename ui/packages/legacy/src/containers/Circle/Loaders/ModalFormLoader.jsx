import React from 'react'
import ContentLoader from 'react-content-loader'
import { ContentLayer } from 'components'
import Styled from 'containers/Circle/ModalForm/styled'
import UserSVG from 'core/assets/svg/ic_group.svg'

const ItemLoading = () => (
  <ContentLoader
    height="18"
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="0" y="5" rx="0" ry="0" width="300" height="10" />
  </ContentLoader>
)

const ModalFormLoader = () => (
  <Styled.Wrapper>
    <ContentLayer icon={<Styled.CircleIcon />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
    <ContentLayer icon={<UserSVG />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
  </Styled.Wrapper>
)

export default ModalFormLoader
