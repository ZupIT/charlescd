import React from 'react'
import styled, { css } from 'styled-components'

const Content = styled(({ display, disable, ...rest }) => <div {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
  ${({ disable }) => disable && css`
    cursor: not-allowed;
  
    span {
      cursor: not-allowed;
    }
  `};
`

export const StyledResume = {
  Content,
}
