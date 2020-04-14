/* eslint-disable  */

import React from 'react'
import ContentLoader from 'react-content-loader'
import map from 'lodash/map'

const ModulesLoader = () => (
  <ContentLoader
    height={160}
    width={400}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    {map(Array(4).fill(''), (e, i) => (
      <rect
        key={i}
        style={{ opacity: Number(2 / (i + 10)) }}
        x={40 * i}
        y={0}
        rx="3"
        ry="3"
        width="35"
        height="10"
      />
    ))}
  </ContentLoader>
)

export default ModulesLoader
