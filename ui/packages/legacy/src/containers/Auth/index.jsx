import React from 'react'
import Styled from './styled'

const Auth = ({ children }) => {
  return (
    <Styled.Wrapper>
      <Styled.Box>
        {children}
      </Styled.Box>
    </Styled.Wrapper>
  )
}

export default Auth
