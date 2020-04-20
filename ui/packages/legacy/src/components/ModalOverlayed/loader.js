import React from 'react'
import ContentLoader from 'react-content-loader'

const ModalLoader = () => (
  <ContentLoader
    height={800}
    width={400}
  >
    <rect x="20" y="20" rx="6" ry="6" width="200" height="20" />
    <rect x="6" y="50" rx="2" ry="2" width="400" height="5" />
  </ContentLoader>
)

export default ModalLoader
