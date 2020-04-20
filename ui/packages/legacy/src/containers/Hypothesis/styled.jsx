import React from 'react'
import styled from 'styled-components'
import { Input as InputFinalForm } from 'containers/FinalForm'
import Plus from 'core/assets/svg/plus-light-blue.svg'

const defaultMargin = '0 0 20px'

const Wrapper = styled(({ display, ...rest }) => <div {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
`

const Content = styled.div`
  margin: ${({ margin }) => margin || defaultMargin};
`

const Form = styled.div`
  display: flex;
  align-items: flex-end;
`

const Input = styled(InputFinalForm)`
  width: 350px;
`

const DescWrapper = styled.div`
  margin: 20px 0;
`

const DescLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.DEFAULT.FONT_SIZE};
`

const DescInfo = styled.span`
  color: ${({ theme }) => theme.COLORS.COLOR_CHAMBRAY};
  font-size: 12px;
  display: block;
`

export const PlusIcon = styled(Plus)`
  width: 11px;
  margin-right: 10px;
`

export const StyledHypothesis = {
  Wrapper,
  Content,
  Form,
  Input,
  DescWrapper,
  DescLabel,
  DescInfo,
  PlusIcon,
}
