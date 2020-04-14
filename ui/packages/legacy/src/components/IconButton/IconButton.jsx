import React from 'react'
import PropTypes from 'prop-types'
import { Loading } from 'components/Button'
import { StyledButton } from './styled'
import { THEME } from './constants'

const IconButton = (props) => {
  const { type, icon, theme, isLoading, onClick, properties, children, disabled, className } = props

  return (
    <StyledButton.Button
      type={type}
      className={className}
      disabled={disabled}
      buttonTheme={theme}
      onClick={onClick}
      properties={properties}
    >
      <StyledButton.Icon buttonTheme={theme}>
        { isLoading && <Loading /> }
        { !isLoading && icon }
      </StyledButton.Icon>
      <StyledButton.Child>{children}</StyledButton.Child>
    </StyledButton.Button>
  )
}

IconButton.defaultProps = {
  type: 'button',
  theme: THEME.DEFAULT,
  onClick: null,
  isLoading: false,
  properties: {},
  disabled: false,
}

IconButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  theme: PropTypes.string,
  properties: PropTypes.object,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
}

export default IconButton
