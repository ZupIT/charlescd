import styled, { css } from 'styled-components'
import { ModalOverlayed, Button as ComponentButton } from 'components'
import ComponentInputGroup from 'components/InputGroup'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_3};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  width: 350px;
`

const Button = styled(ComponentButton)`
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border: solid 1px ${({ theme }) => theme.COLORS.COLOR_BLACK};
  border-radius: 2px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.COLORS.COLOR_BLACK};
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 134px;
  &:hover {
    box-shadow: inset 0px 0px 0px 64px ${({ theme }) => theme.COLORS.COLOR_BLACK_ALPHA};
  }
  ${({ transparent }) => transparent && css`
    border-color: ${({ theme }) => theme.COLORS.SURFACE};
    color: ${({ theme }) => theme.COLORS.SURFACE};
    background-color: transparent;
  `}
  ${({ primary }) => primary && css`
    background-color: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
    border: none;
    color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  `}
`

const ModalLayed = styled(ModalOverlayed)`
  display: flex;
  height: min-content;
  align-items: center;
  padding: 20px;
  width: 700px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
`

const InputGroup = styled(ComponentInputGroup)`
  width: 355px;
  margin-top: 24px;
`

const Backdrop = styled.div`
  background-color: ${({ theme }) => theme.COLORS.COLOR_FREE_SPEECH_BLUE};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.9;
`

const Title = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`

const Modal = styled.div`
  position: relative;
  width: auto;
  background:  ${({ theme }) => theme.COLORS.COLOR_WHITE};
  padding: 50px;
  width: 320px;
  margin: 5rem auto;
  height: 1050px;
`

const Error = styled.small`
  color: ${({ theme }) => theme.COLORS.COLOR_RED_ORANGE};
`

export default {
  Button,
  Title,
  InputGroup,
  Content,
  Error,
  Wrapper,
  Backdrop,
  Actions,
  Modal,
  ModalLayed,
}
