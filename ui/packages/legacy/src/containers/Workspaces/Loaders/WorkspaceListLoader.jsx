import React from 'react'
import ContentLoader from 'react-content-loader'

const WorkspaceListLoader = () => (

  <div style={{ width: '400px', height: '300px' }}>
    <ContentLoader
      width={400}
      height={300}
      speed={2}
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <rect x="0" y="10" rx="10" ry="1" width="374" height="107" />
      <rect x="0" y="130" rx="10" ry="1" width="374" height="107" />
    </ContentLoader>
  </div>
)

export default WorkspaceListLoader
