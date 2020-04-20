import React from 'react'
import PropTypes from 'prop-types'
import Label from 'components/Label'
import { StyledInput } from './styled'

const Input = (props) => {
  const { className, type, label, onChange, onBlur, onFocus, properties } = props

  const newProperties = {
    ...properties,
    autoComplete: 'off',
  }

  return (
    <StyledInput.Wrapper className={className}>
      { label && <Label id={label} />}
      <StyledInput.Input
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        {...newProperties}
      />
    </StyledInput.Wrapper>
  )
}

Input.defaultProps = {
  label: '',
  type: 'text',
  properties: {},
  onChange: null,
  onBlur: null,
  onFocus: null,
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  properties: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

export default Input
