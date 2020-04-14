import React from 'react'
import PropTypes from 'prop-types'
import { StyledLoading } from './styled'

const LoadingContainer = (props) => {
  const { children, isLoading } = props

  return (
    <StyledLoading.Wrapper {...props}>
      <div>{children}</div>
      {isLoading && (
        <StyledLoading.Container>carregando...</StyledLoading.Container>
      )}
    </StyledLoading.Wrapper>
  )
}

LoadingContainer.defaultProps = {
  isLoading: false,
}

LoadingContainer.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default LoadingContainer
