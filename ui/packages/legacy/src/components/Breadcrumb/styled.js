import styled from 'styled-components'


export const StyledBreadcrumb = styled.ul`
  align-items: center;
  color: ${({ theme }) => theme.COLORS.COLOR_ECLIPSE};
  display: flex;
  flex-direction: row;
  font-size: 12px;
  font-weight: 400;
  list-style-type: none;
  line-height: 14px;
  margin: 0;
  padding: 0;
  text-align: left;
  vertical-align: middle;

  li {
    a {
      color: ${({ theme }) => theme.COLORS.COLOR_BLACK};
      text-decoration: none;

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }

    & + li {
      &:before {
        border: solid ${({ theme }) => theme.COLORS.PRIMARY_DARK};
        border-width: 0 1px 1px 0;
        content: '';
        display: inline-block;
        margin: 0 10px 0 6px;
        padding: 2px;
        transform: rotate(-45deg);
        vertical-align: 7%;
      }
    }
  }
`
