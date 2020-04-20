import React from 'react'
import styled, { css } from 'styled-components'
import { Input as InputFinalForm } from 'containers/FinalForm'
import { ContentPage } from 'components'
import Title from 'components/Title'

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
`

const Content = styled(ContentPage.Default)`
  margin: 0 auto 100px;
  display: flex;
  flex-wrap: wrap;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
`

const ContentDashboard = styled(ContentPage.Dashboard)`
  position: fixed;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
`

const CardBody = styled.div`
  height: 250px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_LICORICE};
`

const CardFooter = styled(({ display, ...rest }) => <div {...rest} />)`
  display: ${({ display }) => display || 'flex'};
  height: 36px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
`

const CardFooterItem = styled.div`
  display: flex;
  width: 29%;
  padding: 0 0 0 4%;
  font-size: 12px;
  align-items: center;
`

const CardFooterText = styled.span`
  padding-left: 5px;
`

const Flex = styled.div`
  display: flex;
`

const Step = styled(({ step, ...rest }) => <div {...rest} />)`
  display: ${({ step }) => step ? 'block' : 'none'};
  margin-bottom: 15px;
`

const Form = styled.div`
  display: ${({ display }) => display || 'flex'};
  align-items: flex-end;
`

const Input = styled(InputFinalForm)`
  width: 350px;
  ${({ spaceBetween }) => spaceBetween && css`
    margin-bottom: 15px;
  `};
`

const Subtitle = styled(Title)`
  font-weight: normal;
`

export const StyledModule = {
  Wrapper,
  Content,
  ContentDashboard,
  Flex,
  Step,
  Form,
  Input,
  Subtitle,
  Card: {
    Body: CardBody,
    Footer: CardFooter,
    FooterItem: CardFooterItem,
    FooterText: CardFooterText,
  },
}
