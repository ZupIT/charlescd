import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  border-radius: 9.6px;
  border-width: 1.5px;
  border-style: solid;
  border-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_BASTILLE};
  height: 50px;
  margin-top: 10px;
  margin-right: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  
  &:last-child {
    margin-right: 0;
  }

  ${({ small }) => small && css`
    height: 15px;
    margin-top: 0px;
  `}

  ${({ selected, theme }) => selected && css`
    border-color: ${theme.COLORS.COLOR_BLACK_MARLIN};
  `} 
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  border-top-left-radius: 9.6px;
  border-bottom-left-radius: 9.6px;

  svg > path {
    fill: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  }

  ${({ small }) => small && css`
    width: 13px;
    padding: 0 5px;
  `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 0 25px;
  border-top-right-radius: 9.6px;
  border-bottom-right-radius: 9.6px;

  ${({ small }) => small && css`
    padding: 0 10px;
  `}
  
  ${({ selected, theme }) => selected && css`
    background: ${theme.COLORS.COLOR_GREY_COMET};
    color: ${theme.COLORS.SURFACE};;
  `}  
`

export const StyledToggle = {
  Wrapper,
  Icon,
  Title,
}
