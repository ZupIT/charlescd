import React from 'react'
import styled, { css } from 'styled-components'
import { backgroundAnimation } from 'core/assets/style/keyframes'
import { RELEASE_TYPES } from 'containers/Moove/constants'

import { Card as ComponentCard } from 'core/components'

const Card = styled(ComponentCard)`
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  color: ${({ theme }) => theme.COLORS.COLOR_ECLIPSE};
  font-size: 14px;
  font-weight: normal;
  padding: 10px 15px;

  ${({ status, theme }) => status === RELEASE_TYPES.BUILD_FAILED && css`
    color: ${theme.COLORS.COLOR_WHITE};
    background: ${theme.COLORS.COLOR_VENETIAN_RED};
  `}

  ${({ status, theme }) => (status === RELEASE_TYPES.BUILT || status === RELEASE_TYPES.NOT_DEPLOYED) && css`
    color: ${theme.COLORS.COLOR_WHITE};
    background: ${theme.COLORS.COLOR_PURPLE_HEART};
  `}

  ${({ status, theme }) => (status === RELEASE_TYPES.DEPLOYED || status === RELEASE_TYPES.VALIDATED) && css`
    color: ${theme.COLORS.COLOR_WHITE};
    background: ${theme.COLORS.COLOR_MOUNTAIN_MEADOW};
  `}

  ${({ status, theme }) => (status === RELEASE_TYPES.BUILDING || status === RELEASE_TYPES.UNDEPLOYING || status === RELEASE_TYPES.DEPLOYING) && css`
    color: ${theme.COLORS.COLOR_WHITE};
    background: linear-gradient(45deg, #13BACC, #613BD2, #13BACC, #613BD2, #13BACC, #613BD2);
    background-size: 600% 100%;
    animation: ${backgroundAnimation} 16s linear infinite;
    animation-direction: alternate;
  `}

  ${({ status, theme }) => status === RELEASE_TYPES.MERGING && css`
    color: ${theme.COLORS.COLOR_WHITE};
    background: linear-gradient(45deg, #13BACC, #613BD2, #13BACC, #613BD2, #13BACC, #613BD2);
    background-size: 600% 100%;
    animation: ${backgroundAnimation} 16s linear infinite;
    animation-direction: alternate-reverse;
  `}
`

const Header = styled(({ hasAction, ...rest }) => <div {...rest} />)`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;

  & > * {
    margin-right: 11px;
  }

  ${({ hasAction }) => hasAction && css`
    & > *:last-child {
      margin-left: auto;
      margin-right: -10px;
    }
  `}
`

const Body = styled.div``

const Content = styled(({ display, ...rest }) => <div {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
  font-size: 12px;
  height: auto;
  margin-top: 10px;
`

const Item = styled.div`
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

const Footer = styled.div``

export default {
  Card,
  Header,
  Body,
  Content,
  Item,
  Footer,
}
