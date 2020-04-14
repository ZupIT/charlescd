import styled, { css } from 'styled-components'
import {
  Button as ButtonComponent,
  Input as InputComponent,
  ModalOverlayed,
} from 'components'

const Wrapper = styled.div`
  margin-bottom: 100px;
`

const Input = styled(InputComponent)`
  margin-top: 20px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const SearchContainer = styled.div`
  margin-top: 40px;
`

const InputSearch = styled.input`
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  border-radius: 20px;
  border: none;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  font-size: ${({ theme }) => theme.DEFAULT.FONT_SIZE};
  padding: 10px;
  margin-bottom: 10px;
  width: 355px;
`

const Modal = styled(ModalOverlayed)`
  display: flex;
  height: min-content;
  padding: 20px;
`

const Action = styled(ButtonComponent)`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.COLORS.COLOR_ROYAL_BLUE};
  margin-top: -42px;
  position: absolute;
  right: 55px; 

  &:hover {
    box-shadow: none;
  }
`

const UserCard = styled.div`
  align-self: flex-start;
  display: flex;
  justify-content: space-between;
  padding: 2px;
  margin-top: 10px;
  min-width: 370px;
  border-radius: 17.5px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_ECLIPSE};
  height: 35px;

  &:hover {
    cursor: pointer;
  }

  svg {
    margin-right: 5px;
  }
`

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const UserCardProfile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  span {
    margin-left: 10px;
  }
`

const UserCardImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 20px;
`

const UserCardMenu = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-right: 10px;
`

const UserModalGroupIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 100%;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  width: 350px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`

const AddGroupModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 81px 84px;
`

const Button = styled(ButtonComponent)`
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  border: solid 1px ${({ theme }) => theme.COLORS.SURFACE};
  border-radius: 2px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 134px;

  &:hover {
    box-shadow: inset 0px 0px 0px 64px ${({ theme }) => theme.COLORS.COLOR_BLACK_ALPHA};
  }

  ${({ primary }) => primary && css`
    background-color: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
    border: none;
    color: ${({ theme }) => theme.COLORS.SURFACE};
  `}
`

export default {
  Action,
  AddGroupModalContent,
  ContainerList,
  Form,
  Input,
  InputSearch,
  Modal,
  UserCard,
  UserCardProfile,
  UserCardImg,
  UserCardMenu,
  UserModalGroupIcon,
  Row,
  SearchContainer,
  Wrapper,
  Button,
}
