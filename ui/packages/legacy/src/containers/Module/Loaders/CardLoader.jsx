import React from 'react'
import { StyledModule } from 'containers/Module/styled'
import ContentLoader from 'react-content-loader'
import map from 'lodash/map'
import { Col } from 'components/Grid'
import { CardBox, CardHeader } from 'components/CardBox'

const numberOfColumns = 3

const CardLoader = () => (
  <StyledModule.Content>
    {map(Array(numberOfColumns), (e, i) => (
      <Col xs="6" lg="4" key={i}>
        <CardBox shadowed large>
          <CardHeader>
            <ContentLoader
              primaryColor="#1C1C1E"
              secondaryColor="#2C2C2E"
            >
              <rect x="0" y="25" rx="1" ry="1" width="50%" height="10" />
            </ContentLoader>
          </CardHeader>
          <StyledModule.Card.Body />
          <StyledModule.Card.Footer display="block">
            <ContentLoader
              primaryColor="#1C1C1E"
              secondaryColor="#2C2C2E"
            >
              <rect x="2%" y="8" rx="1" ry="1" width="30%" height="10" />
              <rect x="35%" y="8" rx="1" ry="1" width="30%" height="10" />
              <rect x="68%" y="8" rx="1" ry="1" width="30%" height="10" />
            </ContentLoader>
          </StyledModule.Card.Footer>
        </CardBox>
      </Col>
    ))}
  </StyledModule.Content>
)

export default CardLoader
