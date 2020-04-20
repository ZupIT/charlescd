import React from 'react'
import ContentLoader from 'react-content-loader'
import { ContentLayer, ContentPage } from 'components'
import CardComment from 'core/assets/svg/card-comment.svg'

const ItemLoading = () => (
  <ContentLoader
    height="10"
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <rect x="0" y="0" rx="0" ry="0" width="100" height="5" />
  </ContentLoader>
)

const ViewLoader = () => (
  <ContentPage.Dashboard>
    <ContentLayer icon={<CardComment />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
    <ContentLayer icon={<CardComment />} margin="0 0 20px">
      <ItemLoading />
    </ContentLayer>
  </ContentPage.Dashboard>
)

export default ViewLoader
