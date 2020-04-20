import styled from 'styled-components'

export const StyledInputWrapper = styled.div``

export const StyledInputField = styled.input`
  width: calc(100% - 12px);
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  font-size: ${({ theme }) => theme.DEFAULT.FONT_SIZE};
  color: ${({ theme }) => theme.COLORS.SURFACE};
  padding-left: 10px;
  height: 36px;
`

export const StyledInput = {
  Wrapper: StyledInputWrapper,
  Input: StyledInputField,
}
