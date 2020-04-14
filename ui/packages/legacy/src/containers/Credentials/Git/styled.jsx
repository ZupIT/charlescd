import React from 'react'
import styled, { css } from 'styled-components'
import { Input as InputFinalForm, Select as SelectFinalForm } from 'containers/FinalForm'

const Block = styled.div`
  ${({ margin }) => margin && css`
    margin-bottom: 20px;
  `}
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
`

const Select = styled(SelectFinalForm)``

export const StyledGit = {
  Block,
  Flex,
  Step,
  Form,
  Input,
  Select,
}
