import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'components/Form'
import FinalFormHoc from './FinalFormHoc'
import { StyledError } from './styled'

const FinalFormCheckbox = (props) => {
  const { input, meta, onChange, onBlur, onFocus, className, properties } = props

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
      <Checkbox
        properties={newProps}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {meta.touched && meta.error && <StyledError>{meta.error}</StyledError>}
    </div>
  )
}

FinalFormCheckbox.defaultProps = {
  onChange: null,
  properties: {},
}

FinalFormCheckbox.propTypes = {
  onChange: PropTypes.func,
  properties: PropTypes.object,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
}

export default FinalFormHoc(FinalFormCheckbox)
