import React from 'react'
import styled from 'styled-components'
import { slideInLeft, slideOutLeft } from 'core/assets/style/keyframes'
import Breadcrumb from 'components/Breadcrumb'
import UserPanel from 'containers/UserPanel'
import { Button } from 'components/Button'
import { Avatar } from 'components'

const Wrapper = styled.div`
  margin-top: 50px;
  overflow: auto;
  display: flex;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
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

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-left: 330px;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
`

const MooveToolbar = styled(props => <UserPanel {...props} />)`
  width: 100%;
`

const Members = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-left: 40px;
  margin-bottom: 20px;
`

const Modules = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-left: 40px;
  margin-bottom: 20px;
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
  justify-content: start;
  align-items: center;
  margin-left: 45px;
  margin-bottom: 20px;
`

const BranchName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 45px;
  margin-bottom: 20px;
`

const ModulesContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-left: 12px;
`

const AddButton = styled(Button)`
  height: 40px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Member = styled(Avatar)`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-left: 10px;

  &:last-of-type {
    margin-right: 30px;
  }
`

const TransitionWrapper = styled.div`
  display: flex;
  width: 60px;
  margin-left: 20px;
`

const BranchNameContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Link = styled.div`
  width: 85%;
  align-items: center;
  border-radius: 20px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  height: 30px;
  margin: 5px 8px 0 0;
  overflow: hidden;
  padding: 10px 20px 10px 0;
  text-decoration: none;

  &.active {
    background: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
    border-radius: 0 20px 20px 0;
  }

  &:last-of-type {
    margin-bottom: 100px;
  }

  &:hover {
    background: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
    border-radius: 0 20px 20px 0;
    transition: background 0s .1s;
  }
`

const EmptyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  margin-top: 70px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.COLOR_LIGHT_STEEL_BLUE};

  & > img {
    width: 578px;
    height: 301px;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  width: calc(100vw - 65px);

  svg {
    width: 50px;
    height: 50px;
  }
`

export default {
  Wrapper,
  Breadcrumb: StyledBreadcrumb,
  BranchName,
  BranchNameContent,
  Comments,
  Description,
  Link,
  LoadingWrapper,
  Member,
  Members,
  Modules,
  AddButton,
  ModulesContent,
  Toolbar: MooveToolbar,
  TransitionWrapper,
  Empty: EmptyWrapper,
  Content,
}
