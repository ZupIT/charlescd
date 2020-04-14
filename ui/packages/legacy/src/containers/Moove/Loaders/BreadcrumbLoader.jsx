import React from 'react'
import ContentLoader from 'react-content-loader'

const BreadcrumbLoader = () => (
  <div style={{ width: '200px' }}>
    <ContentLoader
      width="200"
      height="10"
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <rect x="0" y="10" rx="1" ry="1" width="200" height="10" />
    </ContentLoader>
  </div>
)

export default BreadcrumbLoader
