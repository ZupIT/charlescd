import React from 'react'
import PropTypes from 'prop-types'
import { THEME, SIZE } from './constants'
import { StyledButton } from './styled'

const Button = (props) => {
  const {
    type,
    children,
    onClick,
    isLoading,
    className,
    theme,
    properties,
    margin,
    size,
    disabled,
    form,
  } = props

  return (
    <StyledButton.Button
      buttonTheme={theme}
      className={className}
      isLoading={isLoading}
      margin={margin}
      onClick={onClick}
      size={size}
      type={type}
      disabled={disabled || isLoading}
      form={form}
      {...properties}
    >
      { isLoading && <StyledButton.Loading title="loading" /> }
      { children }
    </StyledButton.Button>
  )
}

Button.defaultProps = {
  isLoading: false,
  margin: '0px',
  onClick: null,
  properties: {},
  size: SIZE.DEFAULT,
  theme: THEME.DEFAULT,
  type: 'button',
  form: null,
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  margin: PropTypes.string,
  onClick: PropTypes.func,
  properties: PropTypes.object,
  size: PropTypes.oneOf([SIZE.SMALL, SIZE.DEFAULT, SIZE.MEDIUM]),
  theme: PropTypes.oneOf([THEME.OUTLINE, THEME.DEFAULT]),
  type: PropTypes.string,
  form: PropTypes.string,
}

export default Button
