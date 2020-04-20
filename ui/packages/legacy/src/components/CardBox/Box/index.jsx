import React from 'react'
import PropTypes from 'prop-types'
import { StyledCard } from './styled'

const CardBox = (props) => {
  const { shadowed, small, large, children, onClick, className } = props

  return (
    <StyledCard.Box
      className={className}
      shadowed={shadowed}
      small={small}
      large={large}
      onClick={onClick}
    >
      {children}
    </StyledCard.Box>
  )
}

CardBox.defaultProps = {
  shadowed: false,
  small: false,
  large: false,
  onClick: null,
}

CardBox.propTypes = {
  shadowed: PropTypes.bool,
  small: PropTypes.bool,
  large: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export default CardBox
