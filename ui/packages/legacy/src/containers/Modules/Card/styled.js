import styled from 'styled-components'

const Wrapper = styled.div`
  display: inline-block;
  border-radius: 6px;
  cursor: pointer;
`

const Header = styled.div`
  border-radius: 6px;
  padding: 25px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  color: ${({ theme }) => theme.COLORS.SURFACE};
  display: flex;
  justify-content: space-between;
`

const Content = styled.div``

const Footer = styled.div`
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 12px 50px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
`

export default {
  Wrapper,
  Header,
  Content,
  Footer,
}
