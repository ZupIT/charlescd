import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  width: 100%;
`

const Span = styled.span`
  align-items: center;
  box-sizing: border-box;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  display: flex;
  font-size: 14px;
  height: 100%;
  justify-content: center;
  padding: 0px 12px;
  flex: none;
`

const Input = styled.input`
  border: none;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  box-sizing: border-box;
  font-size: 14px;
  height: 100%;
  margin-left: -1px;
  padding: 0px 12px;
  width: 100%;
`

export const Styled = {
  Input,
  Span,
  Wrapper,
}
