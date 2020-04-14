import React from 'react'
import Styled from './styled'

const CardModule = ({ name, onClick }) => (
  <Styled.Wrapper onClick={onClick}>
    <Styled.Header>
      {name}
    </Styled.Header>
  </Styled.Wrapper>
)

export default CardModule
