import React from 'react'
import ContentLoader from 'react-content-loader'

const PreviewLoader = () => (
  <ContentLoader
    height={108}
    width={500}
    speed={2}
    primaryColor="#1C1C1E"
    secondaryColor="#2C2C2E"
  >
    <circle cx="20" cy="30" r="17" />
    <circle cx="70" cy="30" r="17" />
    <circle cx="120" cy="30" r="17" />
    <circle cx="170" cy="30" r="17" />
    <circle cx="220" cy="30" r="17" />
    <circle cx="270" cy="30" r="17" />
    <circle cx="320" cy="30" r="17" />
    <circle cx="370" cy="30" r="17" />
    <circle cx="20" cy="88" r="17" />
    <circle cx="70" cy="88" r="17" />
    <circle cx="120" cy="88" r="17" />
    <circle cx="170" cy="88" r="17" />
    <circle cx="220" cy="88" r="17" />
    <circle cx="270" cy="88" r="17" />
    <circle cx="320" cy="88" r="17" />
    <circle cx="370" cy="88" r="17" />
  </ContentLoader>
)

export default PreviewLoader
