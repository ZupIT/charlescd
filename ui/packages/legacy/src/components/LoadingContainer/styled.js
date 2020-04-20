import styled from 'styled-components'

export const StyledLoadingWrapper = styled.div`
  position: relative;
  height: 100vh;
`

export const StyledLoadingContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: ${({ theme }) => theme.DEFAULT.BODY_BACKGROUND};
`


export const StyledLoading = {
  Wrapper: StyledLoadingWrapper,
  Container: StyledLoadingContainer,
}
