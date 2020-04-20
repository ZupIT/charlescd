import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: flex;
`

const CardWrapper = styled.div`
  display: flex;
  border-radius: 9.6px;
  box-shadow: 0 4px 7px 0 rgba(209, 213, 223, 0.5);
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  height: 50px;
  margin-top: 10px;
  margin-right: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
   
  &:hover {
    box-shadow: 0 10px 20px 0 rgba(209, 213, 223, 0.5);
  }
  
  &:last-child {
    margin-right: 0;
  }
`

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: ${({ color }) => color};
  border-top-left-radius: 9.6px;
  border-bottom-left-radius: 9.6px;
  
  ${({ selected, theme }) => selected && css`
    background: ${theme.COLORS.COLOR_PERSIAN_BLUE};
    color: #fff;
  `}
`

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 0 25px;
  
  border-top-right-radius: 9.6px;
  border-bottom-right-radius: 9.6px;
  
  ${({ selected, theme }) => selected && css`
    background: ${theme.COLORS.COLOR_BLURPLE};
    color: ${theme.COLORS.COLOR_WHITE};;
  `}  
`


export const StyledCardList = {
  Wrapper,
  Card: {
    Wrapper: CardWrapper,
    Icon: CardIcon,
    Title: CardTitle,
  },
}
