import React from 'react'
import ContentLoader from 'react-content-loader'

const FormLoader = () => (
  <ContentLoader
    height="50"
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="0" y="0" rx="5" ry="5" width="100" height="10" />
    <rect x="0" y="13" rx="5" ry="5" width="100" height="10" />
  </ContentLoader>
)

export default FormLoader
