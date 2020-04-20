import React from 'react'
import styled from 'styled-components'
import { Avatar, ModalOverlayed } from 'components'
import Title from 'components/Title'
import { Input as FormInput } from 'components/FormV2/Input'
import { slideInLeft, slideOutLeft } from 'core/assets/style/keyframes'
import UserPanel from 'containers/UserPanel'
import { Button } from 'components/Button'

const Wrapper = styled.div`
  margin-top: 50px;
  overflow: auto;
  display: flex;
  flex-wrap: nowrap;
  height: calc(100vh - 50px);
  flex-direction: row;

  &.page-enter {
    animation: ${slideInLeft} 0.2s forwards;
  }

  &.page-exit {
    animation: ${slideOutLeft} 0.2s forwards;
  }
`

const MooveToolbar = styled(props => <UserPanel {...props} />)`
  width: calc(100% - 60px);
`

const ViewInput = styled(FormInput)`
  margin: 0;
  width: 100%;
  & > input {
    color: ${({ theme }) => theme.COLORS.SURFACE};
    padding: 0;
    font-family: 'Roboto', sans-serif;
    height:50px;
    ${({ description }) => description && `
      font-family: "Roboto";
      font-size: 14px;
      font-weight: 400;
  `}
  }
`

const ViewHeader = styled.div`
  display: flex;
  width: 190px;
  justify-content: space-between;
`

const Members = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-top: 10px;
`

const Member = styled(Avatar)`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-right: 10px;

  &:last-of-type {
    margin-right: 30px;
  }
`

const Description = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-left: 45px;
  margin-bottom: 20px;
`

const Comments = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 200vh;
  word-break: break-word;
  justify-content: start;
  align-items: center;
  margin-left: 45px;
  margin-bottom: 20px;
`

const TransitionWrapper = styled.div`
  display: flex;
  width: 60px;
  margin-left: 20px;
`

const Icon = styled.i`
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 24px;
  font-style: initial;
  font-weight: lighter;
  margin-right: 0;
  display: flex;
  align-items: center;
  & > svg > path{
    fill: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  }
`

const BranchName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
`

const ButtonAdd = styled(Button)`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding: 0;
  justify-content: center;
  background-color: transparent;
  color: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
`

const MembersContent = styled.div`
  position: absolute;
  z-index: 10;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 6px;
  margin-top: 0;
  margin-left: 30px;
`

const ViewTitle = styled(Title)`
  padding: 0 0 0;
`

const ModalViewCard = styled(ModalOverlayed)`
  min-height: 800px;
`

const ViewCardWrapper = styled.div`
  min-width: 800px;
  flex-direction: column;
  padding: 45px 81px;
`

const BranchNameContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ModulesAddButton = styled(Button)`
  height: 40px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledMoove = {
  Wrapper,
  BranchName,
  BranchNameContent,
  Description,
  Comments,
  Member,
  Members,
  ModulesAddButton,
  Toolbar: MooveToolbar,
  TransitionWrapper,
  View: {
    Header: ViewHeader,
    Input: ViewInput,
    Title: ViewTitle,
    Icon,
    ButtonAdd,
    MembersContent,
  },
  Card: {
    Modal: ModalViewCard,
    Wrapper: ViewCardWrapper,
  },
}
