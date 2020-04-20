import React from 'react'
import CirclesEmptySVG from 'core/assets/svg/circles-empty.svg'
import Styled from './styled'

const NotFoundWorkspace = () => (
  <Styled.Wrapper>
    <Styled.Title primary text="permissions.workspace.notLinked" />
    <Styled.Title primary text="permissions.workspace.contactAdm" />
    <Styled.Title primary text="permissions.workspace.contactAdmSequence" />
    <Styled.ImageBox>
      <CirclesEmptySVG />
    </Styled.ImageBox>
  </Styled.Wrapper>
)

export default NotFoundWorkspace
