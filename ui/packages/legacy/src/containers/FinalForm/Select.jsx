import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'components/Form'
import FinalFormHoc from './FinalFormHoc'
import { StyledError } from './styled'

const FinalFormSelect = (props) => {
  const { input, meta, label, children, onChange, onBlur, onFocus, className, properties } = props

  const newProps = {
    ...properties,
    name: input.name,
    value: input.value,
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
      <Select
        label={label}
        properties={newProps}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      >
        {children}
      </Select>
      { meta.touched && meta.error && <StyledError>{meta.error}</StyledError> }
    </div>
  )
}

FinalFormSelect.defaultProps = {
  label: '',
  onChange: null,
  properties: {},
  children: null,
}

FinalFormSelect.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  properties: PropTypes.object,
  children: PropTypes.node,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
}

export default FinalFormHoc(FinalFormSelect)
