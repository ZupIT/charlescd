import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  width: 190px;
  justify-content: space-between;
`

const DescContent = styled.div`
  width: 860px;
  min-height: 50px;
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  padding: 20px 0;
`

export const StyledHypothesisView = {
  Header,
  DescContent,
}
