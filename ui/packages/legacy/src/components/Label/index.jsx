import React from 'react'
import Translate from 'components/Translate'
import { StyledLabel } from './styled'

const Label = ({ id }) => (
  <StyledLabel.Wrapper>
    <Translate id={id} />
  </StyledLabel.Wrapper>
)

export default Label
