import React from 'react'
import ContentLoader from 'react-content-loader'

const LoaderSelect = () => (
  <ContentLoader
    height={30}
    speed={2}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
    style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}
  >
    <rect x="0" y="15" rx="4" ry="4" width="100" height="15" />
  </ContentLoader>
)

export default LoaderSelect
