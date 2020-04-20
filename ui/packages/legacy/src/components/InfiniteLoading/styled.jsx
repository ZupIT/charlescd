import React from 'react'
import styled from 'styled-components'
import Loading from 'core/assets/svg/loading-blue.svg'

const Display = styled(({ display, ...rest }) => <div {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
`

const StyledLoading = styled(({ display, ...rest }) => <Loading {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
  margin: auto;
  width: 100px;
`

export default {
  Display,
  Loading: StyledLoading,
}
