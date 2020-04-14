import React from 'react'
import ContentLoader from 'react-content-loader'

const ListConfigsLoader = () => (
  <div style={{ width: '400px' }}>
    <ContentLoader
      width="800"
      height="600"
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <rect x="0" y="0" rx="1" ry="1" width="300" height="50" />
      <rect x="0" y="80" rx="1" ry="1" width="250" height="290" />
      <rect x="295" y="80" rx="1" ry="1" width="250" height="290" />
    </ContentLoader>
  </div>
)

export default ListConfigsLoader
