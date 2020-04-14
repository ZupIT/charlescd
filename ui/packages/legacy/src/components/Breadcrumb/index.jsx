import React from 'react'
import map from 'lodash/map'
import { StyledBreadcrumb } from './styled'

const FeatureBreadcrumb = ({ children, className }) => {
  return (
    <StyledBreadcrumb className={className}>
      { map(children, (child, index) => (
        <li key={`breadcrumb-item-${index}`}>{ child }</li>
      )) }
    </StyledBreadcrumb>
  )
}

export default FeatureBreadcrumb
