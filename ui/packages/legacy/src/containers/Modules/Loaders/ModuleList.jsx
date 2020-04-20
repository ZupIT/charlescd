/* eslint-disable  */
import React from 'react'
import map from 'lodash/map'
import ContentLoader from 'react-content-loader'

const ModuleList = () => (
  <ContentLoader
    height={200}
    width={400}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >

    {map(Array(4).fill(''), (e, i) => (
      <rect
        key={i}
        x={i * 90}
        y="20"
        rx="6"
        ry="6"
        width="80"
        height="20"
      />
    ))}
  </ContentLoader>
)

export default ModuleList
