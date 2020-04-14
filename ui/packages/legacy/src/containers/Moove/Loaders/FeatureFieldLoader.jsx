import React from 'react'
import ContentLoader from 'react-content-loader'

const FeatureFieldLoader = () => (
  <div style={{ width: '800px' }}>
    <ContentLoader
      width="800"
      height="112"
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <circle cx="20" cy="20" r="17" />
      <rect x="55" y="10" rx="1" ry="1" width="200" height="20" />
      <rect x="55" y="40" rx="1" ry="1" width="500" height="40" />
    </ContentLoader>
  </div>
)

export default FeatureFieldLoader
