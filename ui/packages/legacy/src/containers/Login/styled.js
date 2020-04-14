import styled from 'styled-components'
import { Button, Input as InputComponent } from 'components'

const Wrapper = styled.div`
  width: 350px;
`

const Input = styled(InputComponent)`
  margin-top: 20px;
`

const CustomButton = styled(Button)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  padding: 18px;
  margin-top: 25px;
  color: #F2F2F7;
  background: #5C37CC;
  border: none;
`

const Link = styled.a`
  margin-top: 10px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  text-decoration: none;
  font-size: 10px;
  cursor: pointer;
`

export default {
  CustomButton,
  Input,
  Link,
  Wrapper,
}
