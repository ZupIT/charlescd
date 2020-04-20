import styled from 'styled-components'
import { Button as ComponentButton } from 'components/Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
  padding: 180px 30px 50px 30px;
  height: 100vh;
`

const Content = styled.div`
  margin-top: 100px;
  width: 450px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 30px;
`

const Title = styled.div`
  width: 195px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;

  & + div {
    margin-top: 30px;
  }
`

const Button = styled(ComponentButton)`
  height: 47px;
  width: 186px;
  box-sizing: border-box;
  height: 48px;
  width: 187px;
  margin-top: 80px;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
`

export default {
  Button,
  Content,
  Row,
  Title,
  Wrapper,
}
