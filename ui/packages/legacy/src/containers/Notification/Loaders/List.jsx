import React from 'react'
import ContentLoader from 'react-content-loader'
import map from 'lodash/map'

const numberOfRows = 9

const Loader = () => (
  map(Array(numberOfRows), (e, i) => (
    <div key={i}>
      <ContentLoader
        primaryColor="#1C1C1E"
        secondaryColor="#2C2C2E"
      >
        <circle cx="30" cy="30" r="30" />
        <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
        <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
      </ContentLoader>
    </div>
  ))
)

export default Loader
