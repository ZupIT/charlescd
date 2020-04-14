import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'components/Form'
import FinalFormHoc from './FinalFormHoc'
import { StyledError } from './styled'

const FinalFormInput = (props) => {
  const { input, meta, label, type, onChange, onBlur, onFocus, className, properties } = props

  const newProps = {
    ...properties,
    name: input.name,
    value: input.value,
    type: input.type,
  }

  const handleBlur = (event) => {
    onBlur && onBlur(event)
    input.onBlur(event)
  }

  const handleFocus = (event) => {
    onFocus && onFocus(event)
    input.onFocus(event)
  }

  const handleChange = (event) => {
    onChange && onChange(event)
    input.onChange(event)
  }

  return (
    <div className={className}>
      <Input
        label={label}
        type={type}
        properties={newProps}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {meta.touched && meta.error && <StyledError>{meta.error}</StyledError>}
    </div>
  )
}

FinalFormInput.defaultProps = {
  label: '',
  type: 'text',
  onChange: null,
  properties: {},
}

FinalFormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  properties: PropTypes.object,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
}

export default FinalFormHoc(FinalFormInput)
