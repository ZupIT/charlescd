import React from 'react'
import styled from 'styled-components'
import { Input as InputFinalForm } from 'containers/FinalForm'

const Form = styled.div`
  display: flex;
  align-items: flex-end;
`

const Input = styled(InputFinalForm)`
  width: 350px;
`

const Step = styled(({ step, ...rest }) => <div {...rest} />)`
  display: ${({ step }) => step ? 'block' : 'none'};
  margin-bottom: 15px;
`

const Label = styled.span`
  display: block;
  margin-bottom: 18px;
`

const Flex = styled.div`
  display: flex;
`

export const StyledCircle = {
  Form,
  Label,
  Input,
  Step,
  Flex,
}
