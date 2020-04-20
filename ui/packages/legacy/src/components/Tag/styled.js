import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  border-radius: 2px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  display: flex;
  flex-direction: row;
  height: 40px;
`

const Container = styled.div`
  padding: 12px;
`

const Icon = styled.div`
  width: 42px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
`

const Action = styled.div`
  width: 25px;
  margin-top: 10px;
`

export const Styled = {
  Action,
  Container,
  Icon,
  Wrapper,
}
