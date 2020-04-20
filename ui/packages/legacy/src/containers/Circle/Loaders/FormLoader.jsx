import React from 'react'
import ContentLoader from 'react-content-loader'

const FormLoader = () => (
  <div style={{ width: '400px' }}>
    <ContentLoader
      width="800"
      height="300"
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
    >
      <rect x="0" y="0" rx="1" ry="1" width="100%" height="50" />
      <rect x="0" y="70" rx="1" ry="1" width="100%" height="50" />
    </ContentLoader>
  </div>
)

export default FormLoader
