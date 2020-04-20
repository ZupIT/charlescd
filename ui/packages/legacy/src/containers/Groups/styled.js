import styled, { css } from 'styled-components'
import Card from 'components/Card'
import {
  Button as ButtonComponent,
  ModalOverlayed,
} from 'components'


const Wrapper = styled.div`
  margin-bottom: 100px;
`

const Modal = styled(ModalOverlayed)`
  height: auto;
`

const GroupCard = styled(Card)`
  background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  color: ${({ theme }) => theme.COLORS.SURFACE};
  margin: 20px 0;
  width: 50%;
  margin-bottom: 35px;

  &:first-of-type {
    margin-top: 45px;
  }
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
  
  svg {
    margin-left: 10px;
  }
`

const Button = styled(ButtonComponent)`
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

  ${({ primary }) => primary && css`
    background-color: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
    border: none;
    color: ${({ theme }) => theme.COLORS.SURFACE};
  `}
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & * {
    margin-right: 5px;
  }
`

const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const GroupCardBody = styled.div`
  display: flex;
  justify-content: space-between;
`

const GroupCardFooter = styled.div`
  display: flex;
  flex-direction: row;
`

const GroupCardFooterItem = styled.div`
  margin-right: 20px;
`

const RoleItemWrapper = styled.div`
  display: inline-block;
  width: calc(100% / 2);
  box-sizing: border-box;
  padding: 10px;
`

const RoleItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE}
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

export default {
  Button,
  Container,
  ContainerList,
  Card: {
    Wrapper: GroupCard,
    Body: GroupCardBody,
    Footer: {
      Wrapper: GroupCardFooter,
      Item: GroupCardFooterItem,
    },
  },
  InputSearch,
  SearchContainer,
  GroupCardBody,
  RoleItemWrapper,
  RoleItemContent,
  Modal,
  Wrapper,
}
