/* eslint-disable  */
import React from 'react'
import map from 'lodash/map'
import ContentLoader from 'react-content-loader'
import Styled from '../Columns/styled'

const ColumnLoader = props => (
  <Styled.Wrapper>
    <ContentLoader
      height={800}
      width={400}
      primaryColor="#1C1C1E"
      secondaryColor="#2C2C2E"
      {...props}
    >
      <rect x="20" y="20" rx="6" ry="6" width="200" height="20" />
      <rect x="6" y="50" rx="2" ry="2" width="400" height="5" />
      {map(Array(8).fill(''), (e, i) => (
        <rect
          key={i}
          style={{ opacity: Number(2 / (i + 6)) }}
          x="25"
          y={80 + (i * 150)}
          rx="15"
          ry="15"
          width="350"
          height="120"
        />
      ))}
    </ContentLoader>
  </Styled.Wrapper>
)

const BoardLoader = () => (
  <div style={{ display: 'flex' }}>
    {map(Array(4).fill(''), (e, i) => (
      <ColumnLoader key={i} style={{ opacity: Number(2 / (i + 6)).toFixed(1) }} />
    ))}
  </div>
)

export default BoardLoader
