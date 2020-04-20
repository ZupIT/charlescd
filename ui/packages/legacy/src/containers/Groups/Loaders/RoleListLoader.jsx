import React from 'react'
import ContentLoader from 'react-content-loader'
import map from 'lodash/map'
import Styled from '../styled'

const numberOfLoaders = 3

const RoleListLoader = () => (
  <div>
    { map(Array(numberOfLoaders), (e, i) => (
      <Styled.RoleItemWrapper key={i}>
        <ContentLoader
          width="400"
          height="80"
          primaryColor="#1C1C1E"
          secondaryColor="#2C2C2E"
        >
          <rect x="0" y="0" rx="1" ry="1" width="100%" height="80" />
        </ContentLoader>
      </Styled.RoleItemWrapper>
    ))}
  </div>
)

export default RoleListLoader
