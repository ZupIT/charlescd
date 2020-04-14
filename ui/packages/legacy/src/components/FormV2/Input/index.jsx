import React from 'react'
import PropTypes from 'prop-types'
import Label from 'components/Label'
import Styled from './styled'

const Input = React.forwardRef((props, ref) => {
  const { label, properties, className, action, ...rest } = props

  const setRef = (_this) => {
    const refValue = ref ? (ref.current = _this) : _this
    properties(refValue)
  }

  return (
    <Styled.Wrapper className={className}>
      { label && <Label id={label} /> }
      <Styled.Input {...rest} ref={setRef} />
      { action }
    </Styled.Wrapper>
  )
})

Input.defaultProps = {
  label: '',
  resume: false,
  handleKeyUp: false,
  action: null,
}

Input.propTypes = {
  label: PropTypes.string,
  resume: PropTypes.bool,
  properties: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  action: PropTypes.node,
}

export default Input
export { Input }
