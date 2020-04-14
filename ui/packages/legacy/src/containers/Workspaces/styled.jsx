import React from 'react'
import styled, { css } from 'styled-components'
import Card from 'components/Card'
import { ModalOverlayed, ContentLayer, Button, Avatar } from 'components'
import { Input as FormInput } from 'components/FormV2/Input'
import MembersIconSVG from 'core/assets/svg/members.svg'
import SidebarSVG from 'core/assets/svg/sidebar.svg'
import TitleComponent from 'components/Title'

const Wrapper = styled.div``

const Modal = styled(ModalOverlayed)`
  padding: 80px;
`

const Content = styled(ContentLayer)`
  margin-bottom: 35px;
`

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-top: -12px;

  div {
    height: 45px;
    margin: 0;
  }
`

const Input = styled(FormInput)`
  width: 760px;

  input {
    color: ${({ theme }) => theme.COLORS.SURFACE};
  }
`

const Title = styled(TitleComponent)`
  padding: 0;
`

const MembersContent = styled.div`
  position: absolute;
  z-index: 10;
  background-color: ${({ theme }) => theme.COLORS.SURFACE};
  border-radius: 6px;
  margin-top: 0;
  margin-left: 30px;
`

const Members = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  margin-left: 10px;
  margin-top: 3px;
`

const MemberAvatar = styled(Avatar)`
  margin-left: 10px;
  margin-bottom: 10px;
`

const MembersButtonAdd = styled(Button)`
  position: relative;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding: 0;
  justify-content: center;
  background-color: transparent;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const MembersIcon = styled.i`
  color: ${({ theme }) => theme.COLORS.SURFACE};
  font-size: 24px;
  font-style: initial;
  font-weight: lighter;
  margin-right: 0;
  display: flex;
  align-items: center;
  & > svg > path{
    fill: ${({ theme }) => theme.COLORS.SURFACE};
  }
`

const SpaceBetween = styled.div`
  display: inline-flex;
  align-items: flex-start;
  margin-right: 10px;
  margin-top: 20px;
`

const ApplicationCard = styled(Card)`
  background: ${({ theme }) => theme.COLORS.COLOR_VIRIDIAN};
  color: ${({ theme }) => theme.COLORS.SURFACE};
  margin: 20px 0;
  width: 50%;
  margin-bottom: 35px;

  &:first-of-type {
    margin-top: 45px;
  }
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

const Step = styled(({ step, ...rest }) => <div {...rest} />)`
  position: relative;

  ${({ step }) => !step && css`
    :before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
      background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
    }
  `};
`

const MemberIcon = styled(MembersIconSVG)`
  path {
    fill: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  }
`

const SideIcon = styled(SidebarSVG)`
  path {
    fill: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  }
`

export default {
  Wrapper,
  Modal,
  Content,
  Form,
  Input,
  Title,
  Step,
  SideIcon,
  MemberIcon,
  Members: {
    Avatar: MemberAvatar,
    Content: MembersContent,
    Members,
    Button: MembersButtonAdd,
    Icon: MembersIcon,
    SpaceBetween,
  },
  Card: {
    Wrapper: ApplicationCard,
    Body: GroupCardBody,
    Footer: {
      Wrapper: GroupCardFooter,
      Item: GroupCardFooterItem,
    },
  },
}
