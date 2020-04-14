import React from 'react'
import ContentLoader from 'react-content-loader'

const PreviewLoader = () => (
  <ContentLoader
    height={180}
    width={200}
    speed={2}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="0" y="0" rx="1" ry="1" width="NaN" height="10" />
    <circle cx="98" cy="89" r="73" />
    <rect x="26" y="168" rx="0" ry="0" width="146" height="14" />
  </ContentLoader>
)

export default PreviewLoader
