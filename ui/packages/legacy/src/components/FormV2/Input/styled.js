import styled, { css } from 'styled-components'

const Wrapper = styled.div`
`

const Input = styled.input`
  border-radius: 2px;
  border: none;
  box-sizing: border-box;
  font-size: 14px;
  width: 100%;
  height: 45px
  padding: 12px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  background-color: ${({ theme }) => theme.COLORS.COLOR_PAYNES_GREY};
  
  ${({ resume }) => resume && css`
    color: ${({ theme }) => theme.COLORS.SURFACE};
    border: none;
    background: none;
    font-size: 18px;
    font-weight: 700;
    padding-left: 0;

    :focus {
      background: ${({ theme }) => theme.COLORS.COLOR_PAYNES_GREY};
      padding-left: 15px;
      font-size: 14px;
      font-weight: 400;
    }
  `};
`

export default {
  Wrapper,
  Input,
}
