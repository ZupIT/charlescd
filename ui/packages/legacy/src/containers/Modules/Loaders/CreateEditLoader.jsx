/* eslint-disable  */
import React from 'react'
import map from 'lodash/map'
import ContentLoader from 'react-content-loader'

const CreateEditLoader = () => (
  <ContentLoader
    height={200}
    width={400}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="0" y="10" rx="0" ry="0" width="50" height="5" />
    <rect x="0" y="20" rx="0" ry="0" width="100" height="10" />
    <rect x="0" y="40" rx="0" ry="0" width="50" height="5" />
    <rect x="0" y="50" rx="0" ry="0" width="100" height="10" />
    <rect x="0" y="70" rx="6" ry="6" width="80" height="20" />
    <rect x="90" y="70" rx="6" ry="6" width="80" height="20" />
  </ContentLoader>
)

export default CreateEditLoader
