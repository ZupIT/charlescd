import React from 'react'
import { Styled } from './styled'

const Tag = ({ children, icon, action }) => {
  return (
    <Styled.Wrapper>
      <Styled.Icon>
        { icon }
      </Styled.Icon>

      <Styled.Container>
        { children }
      </Styled.Container>

      <Styled.Action>
        { action }
      </Styled.Action>
    </Styled.Wrapper>
  )
}

export default Tag
