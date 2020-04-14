import React from 'react'
import PropTypes from 'prop-types'
import { StyledSelect } from './styled'

const Select = (props) => {
  const { className, children, properties, onChange, onBlur, onFocus } = props

  const extraProperties = {
    ...properties,
  }

  return (
    <StyledSelect.Wrapper className={className}>
      <StyledSelect.Select
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        {...extraProperties}
      >
        {children}
      </StyledSelect.Select>
    </StyledSelect.Wrapper>
  )
}

Select.defaultProps = {
  className: '',
  properties: {},
  onChange: null,
  onBlur: null,
  onFocus: null,
  children: null,
}

Select.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  properties: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

export default Select
