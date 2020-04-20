import React from 'react'
import styled, { css } from 'styled-components'
import Title from 'components/Title'
import { CardBox } from 'components/CardBox'
import Loading from 'core/assets/svg/loading-blue.svg'

const StyledRow = styled.div`
  z-index: 2;
`

const StyledTitle = styled(Title)`
  color: ${({ theme }) => theme.COLORS.COLOR_ZAMBEZI};
  margin-top: ${({ top }) => top || '0px'};
  font-weight: 400;
  font-size: 19px;
`

const ActionHeader = styled.div`
  display: block;
  width: 100%;
  margin-bottom: 0;
  padding-left: 0;
  margin-left: 0;
`

const TabWrapper = styled.div`
  display: flex;
  margin-top: 40px;
`

const StyledContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;

  ${({ isModalOpen }) => isModalOpen && css`
    overflow-y: hidden;
  `};
`

const WrapperLoader = styled(CardBox)`
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  padding: 20px;
  position: relative;
  height: 100%;
`

const DrawnBubble = styled.div`
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  opacity: 0.05;
  height: 90px;
  width: 45px;
  position: absolute;
  right: 0;

  ${({ up }) => up && css`
    height: 90px;
    width: 45px;
    border-bottom-left-radius: 90px;
    border-top-left-radius: 90px;
    bottom: 60px;
  `}

  ${({ down }) => down && css`
    border-radius: 50%;
    width: 90px;
    bottom: 0px;
    right: -10px;
  `}
`

const StyledTabItem = styled.div`
  color: ${({ theme }) => theme.COLORS.SURFACE};
  width: 140px;
  font-weight: 400;
  font-size: 19px;
  cursor: pointer;
  margin: 0 30px 20px 10px;

  ${({ active }) => active && css`
    font-weight: 700;
`};

  &:hover {
    font-weight: 700;
  }
`

const StyledDisplay = styled(({ display, ...rest }) => <div {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
`

const StyledLoading = styled(({ display, ...rest }) => <Loading {...rest} />)`
  display: ${({ display }) => display ? 'block' : 'none'};
  margin: auto;
  width: 100px;
`

const InputSearch = styled.input`
  background: none;
  border: none;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  font-size: ${({ theme }) => theme.DEFAULT.FONT_SIZE};
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  width: 230px;
`

const Action = styled.div`
  align-items: center;
  margin: 5px 0 23px 8px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  width: 260px;
  background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};

  svg {
    margin-left: 10px;
  }
`

const EmptyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.COLOR_PERSIAN_BLUE};
`

const EmptyText = styled.small`
  color: #636366;
`

export default {
  InputSearch,
  Action,
  EmptyWrapper,
  Content: StyledContent,
  ActionHeader,
  Row: StyledRow,
  DrawnBubble,
  Title: StyledTitle,
  Display: StyledDisplay,
  Loading: StyledLoading,
  WrapperLoader,
  Tab: {
    Item: StyledTabItem,
  },
  TabWrapper,
  EmptyText,
}
