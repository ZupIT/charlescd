import React from 'react'
import styled, { css } from 'styled-components'
import { RELEASE_TYPES } from 'containers/Moove/constants'
import { backgroundAnimation } from 'core/assets/style/keyframes'
import { Badge as BadgeComponent } from 'components'
import LoadingSVG from 'core/assets/svg/loading.svg'
import ErrorSVG from 'core/assets/svg/error.svg'
import InfoSVG from 'core/assets/svg/info-large.svg'
import GitSVG from 'core/assets/svg/git-large.svg'

const Card = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 14px;
  font-weight: 300;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  border: 0.7px solid ${({ theme: { COLORS } }) => COLORS.COLOR_GREY};
  cursor: pointer;

  &:first-of-type {
    margin: 0;
  }
  
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
  
  ${({ buildStatus, deploymentStatus }) => (
    buildStatus === RELEASE_TYPES.BUILDING
    || deploymentStatus === RELEASE_TYPES.DEPLOYING
    || deploymentStatus === RELEASE_TYPES.UNDEPLOYING
  ) && css`
    background: linear-gradient(45deg,#13BACC, #613BD2, #13BACC , #613BD2,#13BACC, #613BD2);
    background-size: 600% 100%;
    animation: ${backgroundAnimation} 16s linear infinite;
    animation-direction: alternate;
  `}
`

const HeaderWrapper = styled.div`
  padding: 5px 10px 0 0;
  font-size: 16px;
  font-weight: lighter;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
`

const HeaderItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const HeaderAction = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 240px;
`

const HeaderTitle = styled.h3`
  font-weight: 300;
  font-size: 14px;
  margin: 10px 0 10px 10px;
  padding: 0;
`

const Loading = styled(LoadingSVG)`
  width: 20px;
  height: 20px;
`

const BuildFailed = styled(ErrorSVG)``

const InfoIcon = styled(InfoSVG)`
  margin-left: 10px;
`

const GitIcon = styled(GitSVG)`
  margin: 5px;
`

const CardBadge = styled(BadgeComponent)`
  margin-left: 7px;
  max-width: 100px;
  height: 19px;
  font-size: 10.9px;
  font-weight: normal;
`

const ExpandedContent = styled(({ display, ...rest }) => <div {...rest} />)`
  height: 0px;
  font-size: 12px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: all .2s;

  ${({ display }) => display && css`
    transition: all .2s;
    height: auto;
  `}
`

const ExpandedItem = styled.a`
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 13px;
  border-radius: 35px;
  display: flex;
  height: 28px;
  padding: 5px;
  width: auto;
  margin-bottom: 5px;
`

const CardBorder = styled.div`
  width: 32px;
  height: 4px;
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 2px;
  margin: 8px auto 0;
`

export default {
  Card: {
    Badge: CardBadge,
    ExpandedContent,
    ExpandedItem,
    Border: CardBorder,
  },
  Release: {
    Card,
    Loading,
    BuildFailed,
    InfoIcon,
    GitIcon,
    Header: {
      Wrapper: HeaderWrapper,
      Item: HeaderItem,
      Action: HeaderAction,
      Title: HeaderTitle,
    },
  },
}
