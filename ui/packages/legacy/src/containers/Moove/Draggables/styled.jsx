import React from 'react'
import styled, { css } from 'styled-components'
import { backgroundAnimation } from 'core/assets/style/keyframes'
import DefaultCard from 'components/Board/Card'
import { Badge as BadgeComponent, Button, Avatar } from 'components'
import Error from 'core/assets/svg/error.svg'
import Loading from 'core/assets/svg/loading.svg'
import { RELEASE_TYPES, TYPES } from 'containers/Moove/constants'

const ExpandedAction = styled.button`
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border: none;
  border-radius: 3px;
  content: '';
  cursor: pointer;
  height: 6px;
  left: calc(50% - 24px);
  transition: all .2s ease-in-out;
  width: 30px;

  &:hover {
    transform: scale(1.5);
  }
`

const StatusBadge = styled(BadgeComponent)`
  margin-left: 7px;
  max-width: 100px;

  ${({ status, theme }) => status === RELEASE_TYPES.DEPLOYED && css`
    color: ${theme.COLORS.COLOR_PURPLE_HEART};
  `}
`

const ExpandedButton = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  color: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  height: 32px;
  justify-content: center;
  margin: 5px;
  padding: 10px;
  width: 106px;
  transition: height 1s;

  &:hover {
    box-shadow: inset 0px 0px 0px 64px ${({ theme }) => theme.COLORS.COLOR_BLACK_ALPHA};
    transition: height 1s;
  }
`

const ExpandedActionContent = styled(({ display, ...rest }) => <div {...rest} />)`
  display: none;

  ${({ display }) => display && css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 5px;
  `}
`

const ExpandedItem = styled.a`
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
  border-radius: 30px;
  align-items: center;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  display: flex;
  height: 30px;
  padding: 5px 0px 5px 10px;
  width: auto;
  margin-bottom: 10px;

  svg {
    margin-right: 5px;
  }

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const ExpandedContent = styled(({ display, ...rest }) => <div {...rest} />)`
  border-radius: 6px;
  height: 0px;
  font-size: 12px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: height 1s;

  ${({ display }) => display && css`
    transition: height 1s;
    height: auto;
  `}
`

const CardWrapper = styled(DefaultCard)`
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  color: red;
  font-size: 14px;
  font-weight: normal;
  padding: 10px 15px;
  word-wrap: break-word;
  white-space: pre-wrap;
  min-height: 60px;

  ${({ type }) => type === TYPES.ACTION && css`
    border: 0;
    border-radius: 6px;
    color: ${({ theme }) => theme.COLORS.COLOR_PAYNES_GREY};

    ${ExpandedAction} {
      display: none;
    }

    ${ExpandedContent} {
      display: none;
    }
  `}

  ${({ type }) => type === TYPES.FEATURE && css`
    border: 0;
    border-radius: 6px;
    background: ${({ theme }) => theme.COLORS.COLOR_BLURPLE};
    color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  `}
`

const CardHeader = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
`

const CardHeaderItem = styled.div`
  width: 240px;
`

const CardMember = styled(Avatar)`
  width: 24px;
  height: 24px;
  border-radius: 16.4px;
  margin-right: 2px;
`

const CardMembers = styled.div`
  margin-top: 10px;
`

const CardContent = styled.div`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const NewCardContent = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
`

const ReleaseWrapper = styled(DefaultCard)`
  background: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 14px;
  font-weight: normal;
  padding: 10px 15px;
  
  ${({ buildStatus, theme }) => buildStatus === RELEASE_TYPES.DEPRECATED && css`
    background: ${theme.COLORS.COLOR_SILVER};
  `}
  
  ${({ buildStatus, theme }) => buildStatus === RELEASE_TYPES.VALIDATED && css`
    background: ${theme.COLORS.COLOR_CARIBBEAN_GREEN};
  `}
  
  ${({ buildStatus, theme }) => buildStatus === RELEASE_TYPES.BUILD_FAILED && css`
    background: ${theme.COLORS.COLOR_VENETIAN_RED};
  `}

  ${({ deploymentStatus, theme }) => deploymentStatus === RELEASE_TYPES.DEPLOYED && css`
    background: ${theme.COLORS.COLOR_CARIBBEAN_GREEN};
  `}
  
  ${({ buildStatus, deploymentStatus }) => (buildStatus === RELEASE_TYPES.BUILDING || buildStatus === RELEASE_TYPES.UNDEPLOYING || deploymentStatus === RELEASE_TYPES.DEPLOYING) && css`
    background: linear-gradient(45deg,#13BACC, #613BD2, #13BACC , #613BD2,#13BACC, #613BD2);
    background-size: 600% 100%;
    animation: ${backgroundAnimation} 16s linear infinite;
    animation-direction: alternate;
  `}
`

const ReleaseHeader = styled.div`
  border-bottom: ${({ theme, open }) => open ? `1px solid ${theme.COLORS.COLOR_LIGHT_STEEL_BLUE}` : 'none'};
  cursor: pointer;
  justify-content: space-between;
  margin-bottom: 7px;
`

const ReleaseHeaderItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-bottom: 10px;
`

const ReleaseHeaderAction = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 240px;
`

const ReleaseList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  max-height: 100px;
  overflow-y: auto;
`

const ReleaseLoading = styled(Loading)`
  width: 20px;
  height: 20px;
`

const ReleaseBuildFailed = styled(Error)``

const ReleaseListItem = styled.li`
  padding: 15px 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.COLOR_LIGHT_STEEL_BLUE};
`

const ReleaseBottom = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
  cursor: pointer;
`

const NewCardButton = styled(Button)`
  width: 45%;
  justify-content: center;
`

const NewCardName = styled.input`
  border: 0;
  width: 100%;
  height: 30px;
`

const Description = styled.textarea`
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  border: none;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.COLORS.COLOR_GHOST_WHITE};
  width: 100%;
  resize: none;
`

export const Styled = {
  Card: {
    Badge: StatusBadge,
    Wrapper: CardWrapper,
    Header: CardHeader,
    HeaderItem: CardHeaderItem,
    Content: CardContent,
    NewCardContent,
    Member: CardMember,
    Members: CardMembers,
    ExpandedContent,
    ExpandedItem,
    Button: ExpandedButton,
    Action: ExpandedAction,
    ActionContent: ExpandedActionContent,
    NewCardButton,
    NewCardName,
    Description,
  },
  Release: {
    Wrapper: ReleaseWrapper,
    Header: ReleaseHeader,
    HeaderItem: ReleaseHeaderItem,
    HeaderAction: ReleaseHeaderAction,
    List: ReleaseList,
    ListItem: ReleaseListItem,
    Bottom: ReleaseBottom,
    Loading: ReleaseLoading,
    BuildFailed: ReleaseBuildFailed,
  },
}
