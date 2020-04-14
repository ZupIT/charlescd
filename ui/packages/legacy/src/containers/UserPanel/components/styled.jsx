import React from 'react'
import styled, { css } from 'styled-components'
import NoNotificationsSVG from 'core/assets/svg/noNotifications.svg'
import CheckMarkSVG from 'core/assets/svg/check-mark.svg'
import { Button, Avatar } from 'components'
import LinkRoute from 'core/routing/Link'

const commonFont = () => `
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
`

const ProfileTabContainer = styled.div`
  width: 310px;
  height: 100%;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  top: 0;
  transition: right .2s linear;
  right: -310px;

  ${({ open }) => open && css`
    right:0px;
    transition: right .2s linear;
    position: fixed;
  `}
`

const ProfileTabContainerContent = styled.div`
  overflow-y: scroll;
  height:calc(100% - 50px);
`

const ProfileTabContainerPlaceholder = styled.div`
  height:50px;
  width:300px;
  margin-bottom: 10px;
`

const ProfileTabStep = styled(({ tab, ...rest }) => <div {...rest} />)`
  display: ${({ tab }) => tab ? 'block' : 'none'};
`

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-top: 20px;
  padding: 0 20px;
`

const ProfileDetailsUser = styled.div`
  display: flex;
  align-items: center;
`

const ProfileDetailsUserPicture = styled(Avatar)`
  width: 80px;
  height: 80px;
  border-radius: 6px;
`

const ProfileDetailsUserOptions = styled.div`
  display: flex;
  flex-direction: column;
  height: 80px;
  justify-content: space-around;
  margin-left: 16px;

`

export const HorizontalDivider = styled.div`
  display: inline-block;
  height: 1px;
  width: 100%;
  z-index: 2;
  margin-top: 15px;
  border-top: solid 1px ${({ theme }) => theme.COLORS.COLOR_LINK_WATER};

  ${({ inverted, theme }) => inverted && css`
    border-top: solid 1px ${theme.COLORS.COLOR_BLACK_MARLIN};
  `}
`


const ProfileDetailsUserOptionsButton = styled(Button)`
  justify-content: center;
`

const ProfileDetailsUserInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`

const ProfileDetailsUserInformationName = styled.span`
  ${commonFont};
  color: ${({ theme }) => theme.COLORS.SURFACE};

`

const ProfileDetailsUserInformationEmail = styled.span`
  ${commonFont};
  opacity: 0.61;
  font-weight: normal;
  font-size: 10px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const ProfileDetailsItem = styled.span`
  ${commonFont};
  font-weight: normal;
  margin-top: 15px;
  color: ${({ theme }) => theme.COLORS.SURFACE};

  ${({ overshadow, theme }) => overshadow && css`
    color: ${theme.COLORS.SURFACE};
  `}
`

const ProfileDetailsLogout = styled.span`
  ${commonFont};
  margin-top: 15px;
  margin-left: 15px;
  color: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};

  ${({ overshadow, theme }) => overshadow && css`
    color: ${theme.COLORS.COLOR_GREY_COMET};
  `}

  &:hover {
    cursor: pointer;
  }
`

const ProfileDetailsLink = styled(LinkRoute)`
  ${commonFont};
  font-weight: normal;
  text-decoration: none;
  margin-top: 15px;
  margin-left: 15px;
  color: ${({ theme }) => theme.COLORS.SURFACE};

  ${({ overshadow, theme }) => overshadow && css`
    color: ${theme.COLORS.SURFACE};
  `}

  &:hover {
    cursor: pointer;
  }
`

const MessageCardPictureBox = styled.div`
  width: 50px;
  height: 50px;
`

const MessageCardPicture = styled(Avatar)`
  width: 50px;
  height: 50px;
  border-radius: 100px;
`

const MessageCardContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 22px 15px 11px;
  transition: all 0.2s;
  cursor: pointer;
  box-sizing: border-box;
  border-bottom: solid 2px ${({ theme }) => theme.COLORS.PRIMARY_DARK};

  ${({ theme, read }) => !read && css`
    background-color: ${theme.COLORS.COLOR_NERO};
  `};

  &:hover {
    margin-left: -15px;
    transition: all 0.2s;
  }
`

const MessageCardTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 16px;
  min-height: 50px;
  min-width: 115px;
`

const MessageCardTextName = styled.span`
  font-size: 13px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const MessageCardTime = styled.span`
  font-size: 11px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  margin-top: 10px;
  color: ${({ theme }) => theme.COLORS.COLOR_LINK_WATER};
`


const MessageCardTextResume = styled.span`
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: ${({ theme }) => theme.COLORS.COLOR_LINK_WATER};
  margin-top: 5px;
`

const AlertContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const HelpText = styled.span`
  color: black;
`

const NoNotifications = styled(NoNotificationsSVG)`
  display: block;
  margin: 200px auto 5px;
`

const NoNotificationText = styled.div`
  text-align: center;
`

const WorkspaceWrapper = styled.ul`
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
`

const WorkspaceItem = styled.li`
  font-family: Roboto;
  font-size: 14px;
  text-decoration: none;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-top: 15px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  
  svg {
    visibility: ${({ active }) => active ? 'visible' : 'hidden'};
  }

  &:hover {
    cursor: pointer;
  }
`

const WorkspaceCheck = styled(CheckMarkSVG)``

export const TemporaryTextForPlaceholder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.COLORS.COLOR_LINK_WATER};
`

export const StyledWorkspaces = {
  Wrapper: WorkspaceWrapper,
  Item: WorkspaceItem,
  CheckIcon: WorkspaceCheck,
}

export const StyledProfileTab = {
  ProfileTabContainer,
  ProfileTabContainerContent,
  ProfileTabContainerPlaceholder,
  ProfileTabStep,
}

export const StyledProfileDetails = {
  ProfileDetailsContainer,
  ProfileDetailsUser,
  ProfileDetailsUserPicture,
  ProfileDetailsUserInformation,
  ProfileDetailsUserInformationName,
  ProfileDetailsUserInformationEmail,
  ProfileDetailsUserOptions,
  ProfileDetailsUserOptionsButton,
  HorizontalDivider,
  ProfileDetailsItem,
  ProfileDetailsLink,
  ProfileDetailsLogout,

}

export const StyledAlertTab = {
  AlertContainer,
  NoNotifications,
  NoNotificationText,
}

export const StyledMessageCard = {
  MessageCardPictureBox,
  MessageCardPicture,
  MessageCardContainer,
  MessageCardTextContainer,
  MessageCardTextName,
  MessageCardTextResume,
  MessageCardTime,
}

export const StyledHelpTab = {
  HelpText,
}
