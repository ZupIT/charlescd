import React from 'react'
import ContentLoader from 'react-content-loader'
import map from 'lodash/map'
import { Col } from 'components/Grid'

const numberOfColumns = 4

const ListActivesLoader = () => (
  map(Array(numberOfColumns), (e, i) => (
    <Col xs="6" lg="3" key={i}>
      <ContentLoader
        width="300"
        height="410"
        primaryColor="#1C1C1E"
        secondaryColor="#2C2C2E"
      >
        <rect x="0" y="0" rx="6" ry="6" width="300" height="410" />
      </ContentLoader>
    </Col>
  ))
)

export default ListActivesLoader
