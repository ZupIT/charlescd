import React from 'react'
import { Styled } from './styled'

const InputGroup = ({
  label, text, register, properties, className, ref, ...rest
}) => {

  const setRef = (_this) => {
    const refValue = ref ? (ref.current = _this) : _this
    properties(refValue)
  }

  return (
    <Styled.Wrapper
      className={className}
    >
      <Styled.Span>
        { label }
      </Styled.Span>
      <Styled.Input
        defaultValue={text}
        ref={setRef}
        {...rest}
      />
    </Styled.Wrapper>
  )
}

InputGroup.defaultProps = {
  properties: () => {},
}

export default InputGroup
