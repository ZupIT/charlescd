import styled from 'styled-components'

const Wrapper = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_FREE_SPEECH_BLUE};
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  padding: 12px 17px;
  box-sizing: border-box;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  transition: all 0.2s;

  :hover {
    transform: scale(1.02);
    transition: all 0.2s;
  }
`

const Header = styled.div``

const Body = styled.div``

const Footer = styled.div``

export default {
  Body,
  Footer,
  Header,
  Wrapper,
}
