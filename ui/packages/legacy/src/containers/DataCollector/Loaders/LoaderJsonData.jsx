/* eslint-disable  */
import React, { Fragment } from 'react'
import ContentLoader from 'react-content-loader'
import map from 'lodash/map'

const LoaderJsonResume = () => (
  <ContentLoader
    height={500}
    width={500}
    speed={2}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="20" y="15" rx="4" ry="4" width="201" height="15" />
    {
      map(Array(18), (item, index) => (
        <Fragment key={index}>
          <rect x="55" y={String(80 + (index * 20))} rx="3" ry="3" width="100" height="10" />
          <rect x="20" y={String(77 + (index * 20))} rx="3" ry="3" width="27" height="15" />
        </Fragment>
      ))
    }
  </ContentLoader>
)

export default LoaderJsonResume
