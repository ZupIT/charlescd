import React from 'react'
import PropTypes from 'prop-types'
import { StyledInput } from './styled'

const Checkbox = (props) => {
  const { className, onChange, onBlur, onFocus, properties } = props

  const newProperties = {
    ...properties,
    autoComplete: 'off',
  }

  return (
    <StyledInput.Checkbox
      className={className}
      type="checkbox"
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      {...newProperties}
    />
  )
}

Checkbox.defaultProps = {
  properties: {},
  onChange: null,
  onBlur: null,
  onFocus: null,
}

Checkbox.propTypes = {
  properties: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

export default Checkbox
