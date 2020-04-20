import React from 'react'
import PropTypes from 'prop-types'
import { StyledHeader } from './styled'

const CardHeader = (props) => {
  const { children, className } = props

  return (
    <StyledHeader.Wrapper className={className}>
      {children}
    </StyledHeader.Wrapper>
  )
}

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CardHeader
