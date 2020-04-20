import styled, { css } from 'styled-components'

const borderRadius = '28px'

export const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${({ onClick }) => onClick && css`
    cursor: pointer;
  `};  
`

export const StyledName = styled.div`
  width: 115px;
  height: 56px;
  line-height: 56px;
  font-size: 16px;
  padding: 0 20px;
  border-top-left-radius: ${borderRadius};
  border-bottom-left-radius: ${borderRadius};
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
`

export const StyledTags = styled.span`
  display: flex;
  height: 56px;
  border-top-right-radius: ${borderRadius};
  border-bottom-right-radius: ${borderRadius};
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  padding: 0 20px;
`

export const StyledTag = styled.span`
  padding: 0 15px;
  margin: 13px 0 13px 25px;
  color: ${({ theme }) => theme.COLORS.COLOR_ECLIPSE};
  font-size: ${({ theme }) => theme.DEFAULT.TAG_FONT_SIZE};
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const StyledDivider = styled.div`
  width: 1px;
  height: 30px;
  margin-top: 13px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
`

export const StyledResume = {
  Wrapper: StyledWrapper,
  Name: StyledName,
  Tags: StyledTags,
  Tag: StyledTag,
  Divider: StyledDivider,
}
