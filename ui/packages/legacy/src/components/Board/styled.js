import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: inline-flex;
`

const ColumnHeader = styled.div`
  padding: 15px 10px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme: { COLORS } }) => COLORS.COLOR_PAYNESGREY};
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 0 2px;
  margin: 0 10px;


  &:last-child {
    margin: 0 0 0 10px;
  }
`

const ColumnInner = styled.div``

const ColumnContent = styled.div`
  padding: 10px;

  ${({ withAction }) => {
    return !withAction && css`
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
      max-height: calc(100vh - 50px);
    `
  }}
`

const Card = styled.div`
  background: ${({ theme: { COLORS } }) => COLORS.COLOR_WHITE};
  border-radius: 6px;
  padding: 20px;
  margin: 10px 0;
  border: 0.7px solid ${({ theme: { COLORS } }) => COLORS.COLOR_GREY};
  cursor: pointer;

  &:first-of-type {
    margin: 0;
  }
`

export const StyledBoard = {
  Wrapper,
  Column: {
    Wrapper: ColumnWrapper,
    Header: ColumnHeader,
    Content: ColumnContent,
    Inner: ColumnInner,
  },
  Card,
}
