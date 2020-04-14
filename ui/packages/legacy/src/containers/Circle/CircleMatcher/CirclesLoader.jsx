import React from 'react'
import ContentLoader from 'react-content-loader'
import Styled, { containerWidth } from './styled'

const CirclesLoader = () => (
  <Styled.CirclesLoaderWrapper>
    <ContentLoader
      speed={1}
      width={containerWidth}
      height={475}
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <rect x="0" y="14" rx="2" ry="2" width="280" height="20" />
      <rect x="0" y="51" rx="2" ry="2" width="800" height="25" />
      <rect x="0" y="89" rx="2" ry="2" width="800" height="60" />
      <rect x="0" y="159" rx="2" ry="2" width="800" height="60" />
    </ContentLoader>
  </Styled.CirclesLoaderWrapper>
)

export default CirclesLoader
