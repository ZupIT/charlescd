import styled from 'styled-components'

export const Wrapper = styled.div`
  margin: ${({ margin }) => margin};
  display: flex;
  align-items: ${({ center }) => center ? 'center' : ''};
`

export const Icon = styled.i`
  width: 30px;
  height: 20px;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Content = styled.div`
  width: 100%;
  min-height: 20px;
`

export const StyledContent = {
  Wrapper,
  Icon,
  Content,
}
