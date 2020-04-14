import styled from 'styled-components'

const Wrapper = styled.label`
  display: block;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  font-size: ${({ theme }) => theme.DEFAULT.FONT_SIZE};
`

export const StyledLabel = {
  Wrapper,
}
