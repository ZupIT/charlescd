import styled from 'styled-components'
import { slideFromLeft } from 'core/assets/style/keyframes'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 60px;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  overflow: hidden;
  padding: 50px 0;
  width: calc(100vw - 60px);
  box-sizing: border-box;
  animation-duration: 0.2s;
  animation-name: ${slideFromLeft};
  transition: height 0.1s;
`

const Header = styled.div`
  margin-bottom: 30px;
  padding: 0  50px;
`

const Content = styled.div`
  height: 100%;
  padding: 0 50px;
  overflow-y: auto;
`

const CloseButton = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin-right: 10px;
  }
`

export default {
  Wrapper,
  Header,
  CloseButton,
  Content,
}
