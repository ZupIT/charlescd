import React from 'react'
import ContentLoader from 'react-content-loader'

const MembersListLoader = () => (
  <div style={{ width: '400px', height: '150px' }}>
    <ContentLoader
      height={150}
      width={400}
      speed={2}
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <rect x="0" y="10" rx="1" ry="1" width="374" height="36" />
      <rect x="0" y="60" rx="1" ry="1" width="374" height="36" />
      <rect x="0" y="110" rx="1" ry="1" width="374" height="36" />
    </ContentLoader>
  </div>
)

export default MembersListLoader
